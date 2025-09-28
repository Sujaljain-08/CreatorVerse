import { Playlist } from "../models/playlist.model.js";
import { asyncWrapper } from "../utils/asyncwrapper.js";
import { customErrors } from "../utils/errorHandler.js";

export const createPlaylist = asyncWrapper(async (req, res) => {

    if (!req.body) {
        throw new customErrors(400, "please add name of playlist")
    }
    const { name, description } = req.body

    let result = await Playlist.insertOne({
        "owner": req.user._id,
        name,
        description,
    })

    if(!result){
        throw new customErrors(500, "failed to create playlist")
    }

    res.status(201).send(`${name} is created`)
})

export const getUserPlaylists = asyncWrapper(async (req, res) => {
    
    let playlists = await Playlist.find({
        "owner" : req.user._id
    }).select("-owner -videos")

    if(!playlists){
        res.json("No playlist found")
    }
    
    res.json(playlists); 
})

export const getPlaylistById = asyncWrapper(async (req, res) => {
    const { playlistId } = req.params

    if(!playlistId) throw new customErrors(400, "please enter a valid playListId")
    
    let playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new customErrors(500, "failed to fetch playlist");
    }

    res.json(playlist)
})

export const addVideoToPlaylist = asyncWrapper(async (req, res) => {
    const { playlistId, videoId } = req.params

    if(!playlistId || !videoId){
       throw customErrors(500, "failed to fetch videoId or playistId")
    }

    let playlist = await Playlist.findById(playlistId)

    playlist.videos.push(videoId);

    await playlist.save();

    res.status(200).send(`added video to ${playlist.name}`)
})

export const removeVideoFromPlaylist = asyncWrapper(async (req, res) => {
    const { playlistId, videoId } = req.params
    
    let playlist = await Playlist.findById(playlistId)

    playlist.videos = platlist.videos.filter((id)=>{
        return id !== videoId;
    })

    await playlist.save();

    res.send(`video remove from ${playlist.name} successfully`)

})

export const deletePlaylist = asyncWrapper(async (req, res) => {
    const { playlistId } = req.params
    
    let currentPlaylist = await Playlist.findByIdAndDelete(playlistId)

    res.status(202).send(`deleted ${currentPlaylist.name} successfully`)
})

export const updatePlaylist = asyncWrapper(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if( !name.trim()){
        throw new customErrors(400, "Please enter a valid name")
    }
    
    const currentPlaylist = await Playlist.findById(playlistId);

    currentPlaylist.name = name
    currentPlaylist.description = description

    currentPlaylist.save();

    res.send("updated details successfully");
})