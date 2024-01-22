const { UserModel } = require("../../models/User/User.Model")
const { firebaseAdmin } = require("../../utils/firebasClient")
const uuid = require('uuid')

const chatWithUser = async (req, res) => {
    const roomId = uuid.v4()
    const { ReceiverId } = req.body
    const { UserId } = req.user
    if (!ReceiverId) {
        return res.status(400).json({ message: 'ReceiverId is required' });
    }

    const receiverData = await UserModel.findOne({
        where: {
            UserId: ReceiverId
        }
    })
    const userData = await UserModel.findOne({
        where: {
            UserId: UserId

        }
    })

    //check each room if it contains both users 
    firebaseAdmin.database().ref('Rooms').once('value', (snapshot) => {
        const rooms = snapshot.val()
        if (!rooms) {
            //create a new room in firebase
            firebaseAdmin.database().ref('Rooms').child(roomId).child(UserId).set({
                UserId: UserId,
                Name: userData.Name,
                ProfilePhoto: userData.ProfilePhoto,
                Role: userData.Explorer == 1 ? 'Explorer' : 'Owner',
                LatestMessage: 'No messages yet'
            })
            firebaseAdmin.database().ref('Rooms').child(roomId).child(ReceiverId).set({
                UserId: ReceiverId,
                Name: receiverData.Name,
                ProfilePhoto: receiverData.ProfilePhoto,
                Role: receiverData.Explorer == 1 ? 'Explorer' : 'Owner',
                LatestMessage: 'No messages yet'

            })
            return res.status(200).json({ message: 'Room created successfully' });
        }
        let roomExists = false
        for (const room in rooms) {
            if (rooms[room][UserId] && rooms[room][ReceiverId]) {
                roomExists = true
                return res.status(200).json({
                    message: 'Room already exists',
                    roomId: room
                });
            }
        }
        if (roomExists) {
            return res.status(200).json({ message: 'Room already exists' });
        }


        else {
            //create a new room in firebase
            firebaseAdmin.database().ref('Rooms').child(roomId).child(UserId).set({
                UserId: UserId,
                Name: userData.Name,
                ProfilePhoto: userData.ProfilePhoto,
                Role: userData.Explorer == 1 ? 'Explorer' : 'Owner',
                LatestMessage: 'No messages yet'

            })
            firebaseAdmin.database().ref('Rooms').child(roomId).child(ReceiverId).set({
                UserId: ReceiverId,
                Name: receiverData.Name,
                ProfilePhoto: receiverData.ProfilePhoto,
                Role: receiverData.Explorer == 1 ? 'Explorer' : 'Owner',
                LatestMessage: 'No messages yet'


            })
            return res.status(200).json({ message: 'Room created successfully' });
        }
    }
    )
}


const sendMessage = async (req, res) => {
    const { message, roomId } = req.body
    const { UserId } = req.user
    const messageID = uuid.v4()
    if (!message) {
        return res.status(400).json({ message: 'message is required' });
    }
    if (!roomId) {
        return res.status(400).json({ message: 'roomId is required' });
    }
    firebaseAdmin.database().ref('messages').child(roomId).child(messageID).set({
        message: message,
        SenderId: UserId,
        messageID: messageID,
        createdAt: Date.now()

    })
    //update the latest message in the room

    await firebaseAdmin.database().ref('Rooms').child(roomId).child(UserId).update({
        LatestMessage: message
    })


    //update the other user latest message in the room
    firebaseAdmin.database().ref('Rooms').child(roomId).once('value', (snapshot) => {
        const rooms = snapshot.val()
        for (const user in rooms) {
            if (user !== UserId) {
                firebaseAdmin.database().ref('Rooms').child(roomId).child(user).update({
                    LatestMessage: message
                })
            }
        }
    })





    return res.status(200).json({ message: 'Message sent successfully' });
}


const getAllChatlist = async (req, res) => {
    const { UserId } = req.user
    firebaseAdmin.database().ref('Rooms').once('value', (snapshot) => {
        const rooms = snapshot.val()
        if (!rooms) {
            return res.status(200).json({ message: 'No rooms found' });
        }
        //get all rooms that contains the user
        const userRooms = []
        for (const room in rooms) {
            if (rooms[room][UserId]) {
                userRooms.push(room)
            }
        }
        if (userRooms.length === 0) {
            return res.status(200).json({ message: 'No rooms found' });
        }
        if (userRooms.length > 0) {
            // in each room get the opposite user
            const chatList = []
            userRooms.forEach((room) => {
                for (const user in rooms[room]) {
                    if (user !== UserId) {
                        chatList.push({
                            roomId: room,
                            UserData: rooms[room][user]
                        })
                    }
                }
            })
            return res.status(200).json({ chatList: chatList });
        }

    })
}


module.exports = {
    chatWithUser,
    sendMessage,
    getAllChatlist
}
