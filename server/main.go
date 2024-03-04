package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/mukeshkuiry/anycall/peer"
)

func main() {

	r := mux.NewRouter()
	r.HandleFunc("/peer", peer.HandlePeerConnection)
	http.Handle("/", r)
	log.Println("Serving at localhost:8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))

}
