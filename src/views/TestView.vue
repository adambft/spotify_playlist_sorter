<template>
    <h1>Hello fucker</h1>
    <button class="btn btn-primary me-3" @click="add()">Add</button>
    <button class="btn btn-primary me-3" @click="get50tracks()">See playlist tracks (first 50)</button>
    <button class="btn btn-primary me-3" @click="getAllPlTracks()">Get all playlist tracks</button>
    <button class="btn btn-primary me-3" @click="getoneplaylist()">Get one playlist item</button>
    <button class="btn btn-primary me-3" @click='getsorted()'>Get sorted songs</button>
    <button class="btn btn-primary me-3" @click="getNoSong()">Get song that doesnt exit</button>
</template>

<script>
import * as firebase from '../js_methods/firebase'
import { SpotifyApiUtils } from '../js_methods/spotify_api'

export default {
    data() {
        return {
        };
    },
    methods: {   
        async add() {
            var pl = '2Gti5HH2TmkKctpijmm7hW'
            var xxx = ['00OpO6WZ3njgKoXHeFC4ld' , '00Y89Ir6nXEQdKQb3GLjet' , '00eSBjcEtF8WcKyUKE86ee' , '00hTw7P6jPUio5Qgojw38w' , '01EvpmJCelI4Gbf4Ksp1v2']
            
            await SpotifyApiUtils.addTracksToPlaylist(pl, xxx)
            console.log("added done ====")
        },
        async get50tracks() {
            var pl = '2Gti5HH2TmkKctpijmm7hW'

            await SpotifyApiUtils.getPlaylistTracks(pl, 5, 0)
        },
        async getAllPlTracks() {
            var x = await SpotifyApiUtils.getAllPlaylistTrackIds("2Gti5HH2TmkKctpijmm7hW")
            console.log("All tracks: ", x)
        },

        async getoneplaylist() {
            var x = await SpotifyApiUtils.getOnePlaylist("7pbVe4a4BV972a6b50pk6A")
            console.log("Playlist data: ", x)
        },
        async getsorted() {
            var x = await firebase.readDb(`/${localStorage.getItem('spotifyUserId')}/sorted_songs`)
            console.log("Sorted songs: ", x)
        },
        async getNoSong() {
            var x = await firebase.readDb(`/${localStorage.getItem('spotifyUserId')}/sorted_songs/00OpO638fnjgKoXHeF83d`)
            console.log("No song: ", x)
        }
    },
    async mounted() {
        // console.log(await SpotifyApiUtils.getAllPlaylists())

        // test playlist: 2Gti5HH2TmkKctpijmm7hW
        // happy playlist: 49XDWYO8BRVElIUlVD1k66
        // chill playlist: 7pbVe4a4BV972a6b50pk6A

        // songs: 00OpO6WZ3njgKoXHeFC4ld , 00Y89Ir6nXEQdKQb3GLjet , 00eSBjcEtF8WcKyUKE86ee , 00hTw7P6jPUio5Qgojw38w , 01EvpmJCelI4Gbf4Ksp1v2        
    },
}
</script>