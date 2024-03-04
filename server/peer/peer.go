package peer

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/mukeshkuiry/anycall/models"
	"github.com/mukeshkuiry/anycall/utils"
)

var mu sync.Mutex

func HandlePeerConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := models.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Implement a function to find or create a peer connection room
	room, roomType := findOrCreatePeerConnectionRoom()

	room.Clients[conn] = true
	log.Println("Client connected to room", room.ID)

	if roomType == "already" {
		msg := &models.Message{
			Type:     "join",
			SenderID: "",
			Content:  "",
		}

		handlePeerMessage(conn, *msg)
		conn.WriteJSON(msg)
		conn.WriteJSON(&models.Message{
			Type:     "send offer",
			SenderID: "",
			Content:  "You are sending offer",
		})
	}

	// Implement a function to handle peer messages
	handlePeerMessages(conn)

}

func findOrCreatePeerConnectionRoom() (*models.Room, string) {
	// Implement a function to find or create a peer connection room

	mu.Lock()
	defer mu.Unlock()

	for _, room := range models.PeerConnectionRooms {
		if len(room.Clients) < 2 {
			return room, "already"
		}
	}

	room := &models.Room{
		ID:      utils.GenerateRoomId(),
		Clients: make(map[*websocket.Conn]bool),
	}

	models.PeerConnectionRooms[room.ID] = room

	return room, "new"
}

func handlePeerMessages(conn *websocket.Conn) {
	for {
		var message models.Message
		err := conn.ReadJSON(&message)
		if err != nil {
			fmt.Println("Error reading json.")
			log.Println(err)
			break
		}

		log.Println("Message received:", message)
		// Implement a function to handle peer messages
		if message.Type == "offer" {
			handleSendOffer(conn, message)

		} else if message.Type == "answer" {
			handleSendAnswer(conn, message)
		} else if message.Type == "message" {
			handlePeerMessage(conn, message)
		}
	}
}

func handlePeerMessage(conn *websocket.Conn, message models.Message) {
	// Implement a function to handle peer messages
	room := findPeerConnectionRoom(conn)

	// broadcast to the room
	for client := range room.Clients {
		err := client.WriteJSON(message)
		if err != nil {
			log.Println(err)
			return
		}

	}
}

func findPeerConnectionRoom(conn *websocket.Conn) *models.Room {
	// Implement a function to find the peer connection room for a given connection

	mu.Lock()
	defer mu.Unlock()

	for _, room := range models.PeerConnectionRooms {
		if room.Clients[conn] {
			return room
		}
	}

	return nil
}

func handleSendOffer(conn *websocket.Conn, message models.Message) {
	// Implement a function to handle sending an offer message
	room := findPeerConnectionRoom(conn)

	// broadcast to the room
	for client := range room.Clients {
		if client != conn {
			err := client.WriteJSON(message)
			if err != nil {
				log.Println(err)
				return
			}
		}
	}
}

func handleSendAnswer(conn *websocket.Conn, message models.Message) {
	// Implement a function to handle sending an answer message
	room := findPeerConnectionRoom(conn)

	// broadcast to the room
	for client := range room.Clients {
		if client != conn {
			err := client.WriteJSON(message)
			if err != nil {
				log.Println(err)
				return
			}
		}
	}
}