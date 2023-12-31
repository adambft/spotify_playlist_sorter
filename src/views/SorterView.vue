<template>
    <div class="container-fluid h-100">
        <div class="row pt-3 pb-2">
            <div class="col-auto">
                <span 
                    data-bs-toggle="popover"
                    data-bs-trigger="hover"
                    data-bs-html="true"
                    data-bs-content="This is where you can start sorting your songs. <br> <br> Select the playlist(s) on the right that you want to add this song to, then click <b class='text-success'>'Save'</b> <br> <br> If you don't want to add the song to any of your playlists, click <b class='text-secondary'>'Not my jam anymore'</b>."
                    ><font-awesome-icon icon="fa-solid fa-circle-question" class="fa-lg text-success" />
                </span>
            </div>
            
            <div class="col p-0 pt-1">
                <div class="progress rounded-5 p-0 bg-progress-custom position-relative" role="progressbar" :aria-valuenow="perc_songs_sorted" aria-valuemin="0" aria-valuemax="100" style="height: 20px">
                    <div class="position-absolute w-100 text-center" v-if="perc_songs_sorted < 10">{{ num_songs_sorted }}/{{ total_num_songs }} Songs Sorted</div>
                    <div class="progress-bar bg-success" :style="{width: `${perc_songs_sorted}%`}">{{ perc_songs_sorted >= 10 ? `${num_songs_sorted }/${ total_num_songs } Songs Sorted` : `` }}</div>
                </div>
            </div>

            <div class="col-auto">
                <button 
                    class="btn btn-sm btn-secondary rounded-3"
                    data-bs-toggle="popover"
                    data-bs-trigger="hover"
                    data-bs-html="true"
                    data-bs-content="Click here to update your Spotify playlists with your sorted songs."
                    @click="openSaveConfirmationModal()"
                >
                    <font-awesome-icon icon="fa-solid fa-floppy-disk" class="fa-lg" />
                </button>
            </div>
        </div>

        <div class="row h-100">
            <div class="col-md-6 col-12">
                <div class="sticky-top pt-3">
                    <div :class="curr_track==null ? 'd-none' : ''" class="text-start">
                        <div class="mb-3">
                            <div id="embed-iframe"></div>
                        </div>
                        
                        <div v-if="all_spotify_genres !== null && all_lastfm_genres !== null">
                            <span 
                                v-if="all_spotify_genres.length > 0 || all_lastfm_genres.length > 0"
                                class="me-3 ms-2 pb-2"
                                data-bs-toggle="popover"
                                data-bs-trigger="hover"
                                data-bs-html="true"
                                data-bs-content="These are tags associated with this song. <br> <br> <b class='text-success'>Spotify Tags</b> are tags that Spotify has associated with the artist(s). <br> <br> <b class='text-primary'>LastFM Tags</b> are tags that LastFM API has associated with the song."
                                ><font-awesome-icon icon="fa-solid fa-circle-question" class="fa-lg text-secondary" />
                            </span>
    
                            <span class="badge rounded-pill text-bg-success py-2 px-3 me-2 mb-3" v-for="(e_genre, index3) in all_spotify_genres" :key="index3">
                                {{ e_genre }}
                            </span>
        
                            <span class="badge rounded-pill text-bg-primary py-2 px-3 me-2 mb-3" v-for="(e_genre_data, index4) in all_lastfm_genres" :key="index4">
                                {{ e_genre_data.name }}
                            </span>
                        </div>
                    </div>

                    <div :class="curr_track==null ? '' : 'd-none'" class="d-flex justify-content-center align-items-center mt-5 pt-5">
                        <div class="w-100">
                            <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin-pulse fa-4x text-success w-100" />
                            <h3 class="text-center mt-4 text-success">Loading song</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-12 padding-lg">
                <div v-for="(e_playlist, index2) in user_playlists" :key="index2">
                    <div class="card card-styling mt-3 border-0" :class="e_playlist.to_add ? 'bg-selected text-white' : '' " @click="e_playlist.to_add = !e_playlist.to_add">
                        <div class="row g-0">
                            <div class="col-auto">
                                <img v-if="e_playlist.images != null && e_playlist.images.length > 0 " :src="e_playlist.images[0].url" class="rounded-start img-75">
                                <img v-else src="https://placehold.co/75x75?text=No+Img" class="rounded-start">
                            </div>

                            <div class="col d-flex align-items-center ps-3">
                                <h4 class="text-break truncate-two-lines">{{ e_playlist.name }}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-center">
                    <button class="btn btn-secondary btn-sm mt-4 fw-bold rounded-5 px-3" @click="openDelConfirmationModal()">Not my jam anymore</button>
                </div>

                <div class="d-flex justify-content-center my-2">
                    <button class="btn btn-sm btn-clear mt-4 fw-bold rounded-5 px-3" @click="openNewPlaylistModal()"><font-awesome-icon icon="fa-solid fa-circle-plus" class="me-2" />Add New Playlist</button>
                </div>

                <button class="btn btn-success btn-lg m-5 btn-stay-there" @click="checkPlaylistBeforeSave()">Save</button>
                <button class="btn btn-secondary btn-lg m-5 btn-stay-there-2" @click="loadPrevTrack()" v-if="prev_track_id">Go Back</button>
            </div>
        </div>

        <!-- delete confirmation modal -->
        <div class="modal fade" tabindex="-1" id="delModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm this is no longer your jam?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <p><b>{{ curr_track ? curr_track.name : 'This song' }}</b> will NOT be added to any of your new playlists.</p>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="confirmDelete()" data-bs-dismiss="modal">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- save confirmation modal -->
    <div class="modal fade" tabindex="-1" id="saveConfirmation">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm export to your Spotify playlists?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <p>Exporting your songs to Spotify may take awhile.</p>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" @click="pushSortedSongsToSpotify()">Confirm</button>
                </div>
            </div>
        </div>
    </div>

    <!-- export progress modal -->
    <div class="modal fade" tabindex="-1" id="exportProgress" data-bs-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Exporting to Spotify...</h5>
                </div>

                <div class="modal-body">
                    <div v-for="(e_pl, index5) in user_playlists" class="mb-2 ms-3">
                        <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin-pulse me-3" v-if="!playlists_pushed.includes(e_pl.id)" />
                        <font-awesome-icon icon="fa-solid fa-circle-check" class="me-3 text-success" v-else />
                        {{ e_pl.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- create new playlist modal -->
    <div class="modal fade" tabindex="-1" id="addPlaylistModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add New Playlists to Your Spotify Account</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div v-for="(e_new_pl, index2) in new_playlists" class="mb-5" :key="index2">
                        <div class="mb-3">
                            <h5 class="d-inline">Playlist {{ index2+1 }}</h5>
                            <span class="badge rounded-pill text-bg-secondary ms-3 del-button" @click="remove_playlist(index2)" :class="new_playlists.length>1 ? '': 'd-none'">Delete</span>
                        </div>

                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" :id="`name-${index2}`" placeholder="" v-model="e_new_pl.name">
                            <label :for="`name-${index2}`">Name</label>
                        </div>

                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" :id="`desc-${index2}`" placeholder="" v-model="e_new_pl.description">
                            <label :for="`desc-${index2}`">Description (optional)</label>
                        </div>
                    </div>

                    <button class="btn btn-warning" @click="add_playlist()">Add playlist</button>
                </div>

                <div class="modal-footer">
                    <span class="badge rounded-pill text-bg-danger py-2 px-3 add-pl-err me-auto" :class="add_pl_error_msg=='' ? 'opacity-0' : ''"> {{ add_pl_error_msg }} </span>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" @click="save_new_pl()">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { SpotifyApiUtils } from '../js_methods/spotify_api'
import { LastFmApiUtils } from '../js_methods/lastfm_api'
import * as firebase from '../js_methods/firebase'
import * as bootstrap from 'bootstrap'

export default {
    data() {
        return {
            user_playlists: [],
            curr_track: null,
            artists_info: null,
            all_lastfm_genres: null,
            songs_to_sort: {},
            del_modal: null,
            prev_track_id: null,
            total_num_songs: 0,
            num_songs_sorted: 0,
            save_confirm_modal: null,
            playlists_pushed: [],
            export_progress_modal: null,
            new_playlists: [
                {
                    name: "",
                    description: "",
                }
            ],
            add_pl_error_msg: "",
            add_playlist_modal: null,
        };
    },
    computed: {
        first_artist() {
            return this.curr_track.artists[0].name
        },
        all_artists() {
            if (this.curr_track === null) {
                return ""
            }

            var all_artists = ""

            for (let i = 0; i < this.curr_track.artists.length; i++) {
                let e_artist = this.curr_track.artists[i]
                all_artists += e_artist.name + ", "
            }
            return all_artists.slice(0, -2)
        },
        all_artists_id_csv() {
            if (this.curr_track === null) {
                return ""
            }

            var all_artists = ""

            for (let i = 0; i < this.curr_track.artists.length; i++) {
                let e_artist = this.curr_track.artists[i]
                all_artists += e_artist.id + ","
            }
            return all_artists.slice(0, -1)
        },
        all_spotify_genres() {
            if (this.artists_info === null) {
                return []
            }

            var all_genres = new Set()

            for (let i = 0; i < this.artists_info.length; i++) {
                let e_generes = this.artists_info[i].genres
                
                for (let j = 0; j < e_generes.length; j++) {
                    let e_genre = e_generes[j]

                    all_genres.add(e_genre.toLowerCase())
                }
            }
            
            return [...all_genres]
        },
        perc_songs_sorted() {
            if (this.total_num_songs === 0) {
                return 0
            }

            return Math.round((this.num_songs_sorted / this.total_num_songs) * 100)
        },
    },
    methods: {
        async loadNewTrack(track_id) {
            this.curr_track = await SpotifyApiUtils.getOneTrack(track_id)
            this.artists_info = await SpotifyApiUtils.getArtists(this.all_artists_id_csv)
            this.all_lastfm_genres = await LastFmApiUtils.getTrackTags(this.first_artist, this.curr_track.name, 10)

            // update any current playlist selections
            var sorted_data = await firebase.readDb(`/${localStorage.getItem('spotifyUserId')}/sorted_songs/${track_id}`)
            
            if (sorted_data === null) {
                return
            }

            for (let i = 0; i < this.user_playlists.length; i++) {
                let e_playlist = this.user_playlists[i]
                let e_pl_id = e_playlist.id

                if (sorted_data.hasOwnProperty(e_pl_id)) {
                    this.user_playlists[i].to_add = sorted_data[e_pl_id]
                }
            }
        },
        async updateSongsToSort(limit=50) {
            var all_user_songs = await firebase.readDb(`${localStorage.getItem('spotifyUserId')}/songs_selected`)
            var sorted_songs = await firebase.readDb(`${localStorage.getItem('spotifyUserId')}/sorted_songs`)

            
            if (sorted_songs === "" || sorted_songs === null) {
                sorted_songs = {}
            }

            this.total_num_songs = Object.keys(all_user_songs).length
            this.num_songs_sorted = Object.keys(sorted_songs).length

            for (let song_id in all_user_songs) {
                let e_song = all_user_songs[song_id]

                if (sorted_songs.hasOwnProperty(song_id)) {
                    //check if all playlists accounted for already
                    for (let e_pl_id in this.user_playlists) {
                        let e_new_pl_id = this.user_playlists[e_pl_id].id

                        if (sorted_songs[song_id].hasOwnProperty(e_new_pl_id)) {
                            continue
                        } else {
                            e_song['id'] = song_id
                            this.songs_to_sort[song_id] = e_song
                            break
                        }
                    }
                    continue
                }

                e_song['id'] = song_id
                this.songs_to_sort[song_id] = e_song

                if (Object.keys(this.songs_to_sort).length >= limit) {
                    break
                }
            }

            // if all songs are sorted
            if (Object.keys(this.songs_to_sort).length === 0) {
                alert('All songs sorted!')
            }
        },
        async loadRandomTrack() {
            this.curr_track = null

            var all_song_ids = Object.keys(this.songs_to_sort)
            var random_song_id = all_song_ids[Math.floor(Math.random() * all_song_ids.length)]

            await this.loadNewTrack(random_song_id)
            return
        },
        async saveSelection() {
            // saves sorting selection to firebase
            this.prev_track_id = this.curr_track.id

            var song_id_to_push = this.curr_track.id
            
            var song_data

            if (this.songs_to_sort.hasOwnProperty(song_id_to_push)) {
                song_data = this.songs_to_sort[song_id_to_push]
            } else {
                song_data = await firebase.readDb(`${localStorage.getItem('spotifyUserId')}/songs_selected/${song_id_to_push}`)
            }

            for (let i = 0; i < this.user_playlists.length; i++) {
                let e_playlist = this.user_playlists[i]
                let e_pl_id = e_playlist.id

                song_data[e_pl_id] = e_playlist.to_add
            }

            let spotify_tags = this.all_spotify_genres
            let lastfm_tags = []

            for (let i = 0; i < this.all_lastfm_genres.length; i++) {
                let e_tag = this.all_lastfm_genres[i]
                let e_tag_name = e_tag.name

                lastfm_tags.push(e_tag_name)
            }

            song_data['spotify_tags'] = spotify_tags
            song_data['lastfm_tags'] = lastfm_tags

            // push to firebase
            firebase.writeDb(`${localStorage.getItem('spotifyUserId')}/sorted_songs/${this.curr_track.id}`, song_data)
            this.num_songs_sorted += 1

            // remove from songs_to_sort
            delete this.songs_to_sort[this.curr_track.id]

            // check if any songs left
            if (Object.keys(this.songs_to_sort).length === 0) {
                await this.updateSongsToSort(50)
            }

            // reset playlist selection
            this.resetPlaylistSelection();

            // load new track
            await this.loadRandomTrack()

            // Load the new track URI
            window.EmbedController.loadUri(`spotify:track:${this.curr_track.id}`);

            window.EmbedController.play();
        },
        async confirmDelete() {
            // Clears any selection and pushes to db
            this.resetPlaylistSelection()
            await this.saveSelection()
        },
        resetPlaylistSelection() {
            for (let i = 0; i < this.user_playlists.length; i++) {
                let e_playlist = this.user_playlists[i]
                e_playlist.to_add = false
            }
        },
        openDelConfirmationModal() {
            // Check if user really doesnt want this song added
            this.del_modal.show()
        },
        openSaveConfirmationModal() {
            // Check if user really wants to save
            this.save_confirm_modal.show()
        },
        async checkPlaylistBeforeSave () {
            // check if any playlist is selected
            for (let i = 0; i < this.user_playlists.length; i++) {
                let e_playlist = this.user_playlists[i]
                
                if (e_playlist.to_add) {
                    this.saveSelection()
                    return
                }
            }

            this.openDelConfirmationModal()
            return
        },
        async loadPrevTrack() {
            // reset playlist selection
            this.resetPlaylistSelection();

            // load previous track
            await this.loadNewTrack(this.prev_track_id)

            this.num_songs_sorted -= 1

            // Load the new track URI
            window.EmbedController.loadUri(`spotify:track:${this.curr_track.id}`);

            window.EmbedController.play();

            // get prev sorted data and show selected playlists
            var prev_sorted_data = await firebase.readDb(`${localStorage.getItem('spotifyUserId')}/sorted_songs/${this.curr_track.id}`)

            for (let i = 0; i < this.user_playlists.length; i++) {
                let e_playlist = this.user_playlists[i]
                let e_pl_id = e_playlist.id

                if (prev_sorted_data.hasOwnProperty(e_pl_id)) {
                    e_playlist.to_add = prev_sorted_data[e_pl_id]
                }
            }

            this.prev_track_id = null
        },
        async pushSortedSongsToSpotify() {
            // push sorted songs to spotify playlists

            this.save_confirm_modal.hide()
            this.export_progress_modal.show()

            // wait 1 second to ensure modal is shown
            await new Promise(r => setTimeout(r, 1000));

            var sorted_songs = await firebase.readDb(`${localStorage.getItem('spotifyUserId')}/sorted_songs`)

            var songs_by_playlist = {}

            // add each userplaylist to songs_by_playlist
            for (let i = 0; i < this.user_playlists.length; i++) {
                let e_pl_id = this.user_playlists[i].id

                songs_by_playlist[e_pl_id] = []
            }
            
            // add each song to the playlist
            for (let song_id in sorted_songs) {
                let e_song_data = sorted_songs[song_id]
                
                for (let e_pl_id in songs_by_playlist) {
                    if (e_song_data[e_pl_id]) {
                        songs_by_playlist[e_pl_id].push(song_id)
                    }
                }
            }
            
            // push data to spotify
            for (let e_pl_id in songs_by_playlist) {
                
                let e_song_ids = songs_by_playlist[e_pl_id]

                await SpotifyApiUtils.addTracksToPlaylist(e_pl_id, e_song_ids)
                this.playlists_pushed.push(e_pl_id)
            }

            await new Promise(r => setTimeout(r, 1000));
            this.export_progress_modal.hide()
            this.playlists_pushed = []
        },
        handleSpacebar(e) {
            if (this.isNewPlModalOpen()) {
                return
            }

            // prevent default behaviour
            e.preventDefault();

            // toggle player
            if (window.EmbedController) {
                window.EmbedController.togglePlay();
            }

            return
        },
        isNewPlModalOpen() {
            const modalElement = document.getElementById('addPlaylistModal');
            return modalElement.classList.contains('show');
        },
        openExportProgressModal(close=false) {
            if (close) {
                this.export_progress_modal.hide()
            } else {
                this.export_progress_modal.show()
            }
        },
        remove_playlist(index) {
            this.new_playlists.splice(index, 1)
        },
        add_playlist() {
            var new_pl = {
                name: "",
                description: "",
            }

            this.new_playlists.push(new_pl)
        },
        async save_new_pl() {
            // Check if all new playlists have a name
            for (var i = 0; i < this.new_playlists.length; i++) {
                var e_new_pl = this.new_playlists[i]

                if (e_new_pl.name.trim() == "") {
                    this.add_pl_error_msg = "All new playlists must have a name!"

                    // Remove error message after 3 seconds
                    setTimeout(() => {
                        this.add_pl_error_msg = ""
                    }, 3000);

                    return
                }
            }

            // Add new playlists to Spotify
            for (var i = 0; i < this.new_playlists.length; i++) {
                var e_new_pl = this.new_playlists[i]

                var res = await SpotifyApiUtils.createNewPlaylist(e_new_pl.name, e_new_pl.description)
                this.user_playlists.push(res)
            }

            // Add new playlists to firebase
            await firebase.writeDb(`${localStorage.getItem('spotifyUserId')}/new_playlists`, this.user_playlists)

            // Reset modal and variables
            this.add_playlist_modal.hide()
            this.new_playlists = [
                {
                    name: "",
                    description: "",
                }
            ]
        },
        openNewPlaylistModal() {
            this.add_playlist_modal.show()
        },
    },
    async mounted() {
        if (window.onSpotifyIframeApiReady) {
            window.location.reload();
        }

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.handleSpacebar(e)
            }
        })

        this.del_modal = new bootstrap.Modal(document.getElementById('delModal'), {
            keyboard: false
        })

        this.save_confirm_modal = new bootstrap.Modal(document.getElementById('saveConfirmation'), {
            keyboard: false
        })

        this.export_progress_modal = new bootstrap.Modal(document.getElementById('exportProgress'), {
            keyboard: false
        })

        this.add_playlist_modal = new bootstrap.Modal(document.getElementById('addPlaylistModal'), {
            keyboard: false
        })

        await SpotifyApiUtils.getUserId()
        var get_temp_playlists = await firebase.readDb(`${localStorage.getItem('spotifyUserId')}/new_playlists`)

        // go through user_playlists and get the playlist data from spotify
        for (let i = 0; i < get_temp_playlists.length; i++) {
            let e_playlist = get_temp_playlists[i]
            let playlist_data = await SpotifyApiUtils.getOnePlaylist(e_playlist.id)

            playlist_data['to_add'] = false
            
            this.user_playlists.push(playlist_data)
        }

        await this.updateSongsToSort(50)

        await this.loadRandomTrack()

        // Spotify Player ========================================================== [START]
        const playerScript = document.createElement('script');
        playerScript.src = 'https://open.spotify.com/embed/iframe-api/v1';
        playerScript.async = true;

        document.body.appendChild(playerScript);

        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            const element = document.getElementById('embed-iframe');
            const options = {
                uri: `spotify:track:${this.curr_track.id}`
                };
            const callback = (EmbedController) => {
                // Set EmbedController as a global variable for later use
                window.EmbedController = EmbedController;
            };
            IFrameAPI.createController(element, options, callback);
        };
        // Spotify Player ========================================================== [END]
    }
};
</script>


<style scoped>
    .img-75 {
        width: 75px;
        height: 75px;
        object-fit: cover;
    }
    .img-200 {
        width: 200px;
        height: 200px;
        object-fit: cover;
    }
    .card-styling {
        height: 75px;
        min-width: 1px;
        transition: all 0.2s ease-in-out;
    }
    .card-styling:hover {
        box-shadow: 4px 4px 12px #088538;
    }
    .truncate-two-lines {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .bg-selected {
        background-color: #088538;
    }
    .btn-stay-there {
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 1021;
    }
    .btn-stay-there-2 {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 1021;
    }
    .padding-lg {
        padding-bottom: 125px;
    }
    .bg-progress-custom {
        background-color: #ade9c3;
    }
    .btn-clear:hover {
        background-color: #cbcbcb4c;
        color: #06BE4B;
    }
</style>