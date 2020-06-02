import React, { Component } from 'react'
import axios from 'axios'
import $ from "jquery"
import {ConfigContext} from "../../../../../Context/ConfigContext"
import { responseHandler } from "../../../../../ReduxStore/Shared"
import './AddToPlaylist.css'


/**
 *  Class of AddToplaylists components seen in the side bars 
 * @extends Component
 */

 class AddToPlaylist extends Component {

    static contextType=ConfigContext;

    constructor(props) {
        super(props)
        this.state = {
            /** Array of my PLatlists 
            * @extends MyPlaylists
            * @type {Array<playlists>}
            */
            playlists:[],
            /** Track Id 
            * @extends MyPlaylists
            * @type {string}
            */
            trackid:""
        }
        this.handleClick= this.handleClick.bind(this)
    }

    componentDidMount()
    {

        axios.get(this.context.baseURL +'/me/createdPlaylists',
        {
           headers:{'authorization':"Bearer "+localStorage.getItem('token')}
           }
        ) 
        .then(res => {
            console.log(res)
            if(res.status===200)
            { 
                   this.setState({
                      playlists: res.data.data.playlists.map( playlists => ({
                      
                          /**
                          * ID of the playlist
                           @memberof AddToPlaylists
                           @type {String}
                          *
                          */
                         id:playlists._id,
                        /**
                          * name  of the playlist
                           @memberof AddToPlaylists
                          * 
                           @type {String}
                          */
                      title:playlists.name,
                          /**
                          * Link to image of my playlist
                           @memberof AddToPlaylists
                           @type {Route}
                          * 
                          */
                      imageUrl:playlists.images[0]
                  }))
              }) } else 
              responseHandler(res);
          }).catch(res=>{
              console.log(res);
            }) 
    }

       /**
     * addding  this specific track to the called user playlist id
     * On succes it automatically closes modal 
     * @memberof AddToPlaylist
     * @param {String} id 
     * @returns {void}
     */
    handleClick = (id) => {
        axios.post(this.context.baseURL +'/playlists/'+id+'/tracks' ,
        {
        "id":this.props.trackId
        },
    {
        headers: {
        'authorization': "Bearer " + localStorage.getItem("token"),
      }})
        .then(res => {
            if(res.status===201 || res.status===200){
             
                $(document).ready(function(){
                    $("#AddSongToPlaylist").modal("hide");
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();  
                }
                )
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

render() {
    console.log("trackId:" ,this.props.trackId)
  //  console.log("Addtoplaylist",this.state.trackid)
    return(
    <div>
    <div className="modal" id="AddSongToPlaylist" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered mw-100 w-100" id="create-playlist-modal" role="document">
    <div className="modal-content" id="modal-content-create" >

    <div className="dialog" id="text-abv-modal">
         <button type="button"  data-dismiss="modal" id="modal-close-btn" aria-label="Close">
          <span aria-hidden="true">X </span>
        </button>

        <div className="modal-header" id="playlist-modal-header">
        <h5 className="modal-title" id="modal-title">Add to Playlist</h5>
     </div> 

      </div>
       
      <div className="modal-body" id="modal-body-share">
      <div className="row" >
                     <div className="playlist-items-wrapper">
                     {this.state.playlists.map(playlist => (
                                        <div className="playlist-item-wrapper"  id={playlist.id} onClick={() => this.handleClick(playlist.id)} >
                                            <div className="playlist-index-img-background"  >
                                                <img src={playlist.imageUrl} alt="Playlist image"
                                                 onError={e => { 
                                                    e.target.src = 'https://cdn.discordapp.com/attachments/715652769096400926/717161952056574012/temp.jpg';}}
                                            >
                                                <div className="playlist-icon-wrapper"   >
                                                <i class="fa fa-plus" aria-hidden="true"></i>
                                                </div>
                                                </img>
                                                <div className="playlist-img-text-wrapper" >               
                                                    <div className="playlist-subtitle"  >
                                                        <div className="my-playlist-playlist-info">
                                                            <div id="playlist-title"> {playlist.title}</div>
                                                            </div>
                                                    </div>
                                                </div> 
                                            </div>
                                        </div>   ))}

                 </div>
                 </div>

        
      </div>

      <div className="modal-footer" id="playlist-modal-footer">

           <button  type="button" data-dismiss="modal" id="cancel-create-btn">cancel</button>
      </div>

      
  </div>
</div>
</div>
</div>
    )}
}
export default AddToPlaylist

