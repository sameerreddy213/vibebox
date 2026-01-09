import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from './Card'

function Albums(props) { //albums ,setAlbumId
    const navigate = useNavigate(); //for navigating to /albums


    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" >
            {props.albums.map((album) => {
                let imageUrl = '';
                if (album.image) {
                    if (Array.isArray(album.image)) {
                        if (album.image.length > 2) imageUrl = album.image[2].url;
                        else if (album.image.length > 0) imageUrl = album.image[album.image.length - 1].url;
                    } else {
                        imageUrl = album.image
                    }
                }
                return <Card onClick={() => { props.setAlbumId(album.id); navigate("/albums") }} key={album.id} image={imageUrl} name={album.name.replace(/&quot;/g, '"')} />
            })}
        </div>
    )
}
export default Albums
