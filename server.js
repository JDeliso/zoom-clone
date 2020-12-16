const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const { v4: uuidV4 } = require("uuid")
const { PeerServer } = require("peer")

const peerServer = PeerServer({ port: 3001, path: '/'})

app.set('view engine', 'ejs')
app.use(express.static('public'))

// home route
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

//individual room route
app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(3000)