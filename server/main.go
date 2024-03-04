package main

import (
	"log"
	"net/http"

	"github.com/mukeshkuiry/anycall/peer"
)

func main() {

	http.HandleFunc("/peer", peer.HandlePeerConnection)

	log.Println("Serving at localhost:8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))

}
