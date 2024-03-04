package main

// import (
// 	"encoding/json"
// 	"fmt"
// 	"log"
// 	"math/rand"
// 	"net/http"
// 	"sync"
// 	"time"

// 	"github.com/gorilla/websocket"
// )

// var (
// 	upgrader = websocket.Upgrader{
// 		ReadBufferSize:  1024,
// 		WriteBufferSize: 1024,
// 		CheckOrigin: func(r *http.Request) bool {
// 			return true
// 		},
// 	}

// 	rooms = make(map[string]*Room)
// 	mu    sync.Mutex
// )

// type Room struct {
// 	ID      string
// 	Clients map[*websocket.Conn]bool
// }

// func newRoom() *Room {
// 	return &Room{
// 		ID:      generateRoomID(),
// 		Clients: make(map[*websocket.Conn]bool),
// 	}
// }

// func generateRoomID() string {
// 	// Implement a function to generate a unique room ID

// 	rand.Seed(time.Now().UnixNano())

// 	charset := "0123456789"
// 	result := make([]byte, 6)
// 	for i := range result {
// 		result[i] = charset[rand.Intn(len(charset))]
// 	}

// 	return string(result)
// }

// func handleConnections(w http.ResponseWriter, r *http.Request) {
// 	conn, err := upgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	room := findOrCreateRoom()
// 	room.Clients[conn] = true

// 	log.Printf("New connection. Room ID: %s, Total clients in room: %d\n", room.ID, len(room.Clients))

// 	if len(room.Clients) == 2 {
// 		time.Sleep(2 * time.Second)
// 		for client := range room.Clients {
// 			err := client.WriteMessage(websocket.TextMessage, []byte(`{
// 				"id": 32456787658,
// 				"message": "Someone joined the room",
// 				"gender": "male"
// 			}`))

// 			if err != nil {
// 				log.Printf("error: %v", err)
// 				client.Close()
// 				delete(room.Clients, client)
// 			}
// 		}
// 	}

// 	for {
// 		var msgbyte []byte

// 		_, msgbyte, err := conn.ReadMessage()
// 		if err != nil {
// 			log.Printf("error: %v", err)
// 			delete(room.Clients, conn)
// 			break
// 		}

// 		var msg map[string]interface{}
// 		err = json.Unmarshal(msgbyte, &msg)
// 		if err != nil {
// 			log.Printf("error: %v", err)
// 			delete(room.Clients, conn)
// 			break
// 		}

// 		// Handle different message types
// 		switch msgType := msg["type"].(string); msgType {
// 		case "offer":
// 			handleOfferMessage(conn, msg)
// 		case "answer":
// 			handleAnswerMessage(conn, msg)
// 		case "iceCandidate":
// 			handleICECandidateMessage(conn, msg)
// 		case "mediaStreamData":
// 			handleMediaStreamData(conn, msg)
// 		default:
// 			// Log the message
// 			log.Printf("Room ID: %s, Message: %s\n", room.ID, msg)

// 			// Broadcast message to all clients in the room
// 			for client := range room.Clients {

// 				err := client.WriteMessage(websocket.TextMessage, msgbyte)
// 				if err != nil {
// 					log.Printf("error: %v", err)
// 					client.Close()
// 					delete(room.Clients, client)
// 				}

// 			}

// 		}

// 	}
// }

// func handleOfferMessage(conn *websocket.Conn, msg map[string]interface{}) {
// 	// Handle offer message
// }

// func handleAnswerMessage(conn *websocket.Conn, msg map[string]interface{}) {
// 	// Handle answer message
// }

// func handleICECandidateMessage(conn *websocket.Conn, msg map[string]interface{}) {
// 	// Handle ICE candidate message
// }

// func handleMediaStreamData(conn *websocket.Conn, msg map[string]interface{}) {
// 	// Handle media stream data
// }

// func findOrCreateRoom() *Room {
// 	mu.Lock()
// 	defer mu.Unlock()

// 	for _, room := range rooms {
// 		if len(room.Clients) == 1 {
// 			return room
// 		}
// 	}

// 	room := newRoom()
// 	rooms[room.ID] = room

// 	log.Printf("New room created. Room ID: %s\n", room.ID)

// 	return room
// }

// func main() {
// 	http.HandleFunc("/ws", handleConnections)

// 	fs := http.FileServer(http.Dir("public"))
// 	http.Handle("/", fs)

// 	fmt.Println("Server started on :2003")
// 	err := http.ListenAndServe(":2003", nil)
// 	if err != nil {
// 		log.Fatal("ListenAndServe: ", err)
// 	}
// }
