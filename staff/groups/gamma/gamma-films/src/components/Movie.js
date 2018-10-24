import React, { Component } from 'react'
import logic from '../logic'

class Movie extends Component {
    state = {
        flag: false,
        theMovie: null,
        theOverview: null,
        thePoster: null,
        theDate: null,
        err: ''
    }

    componentDidMount() {

        const id = this.props.id

        try {
            logic.searchMovie(id)
                .then(movie => {

                    this.setState({ theMovie: movie.original_title, theOverview: movie.overview, thePoster: movie.poster_path, theDate: movie.release_date })


                })
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }

    }

    render() {
        return <div class='card'>
                <div class='card_left'>
                    <img src={'https://image.tmdb.org/t/p/w500/' + this.state.thePoster}></img>
                </div>

                <div class='card_right'>
                    <h1>{this.state.theMovie}</h1>
                    <div class='card_right__details'>
                        <ul>
                            <li>{this.state.theMovie}</li>
                            <li>{this.state.theDate}</li>
                            <li>Action</li>
                        </ul>
                        <div class='card_right__rating'>
                            FAV
                        </div>
                        <div class='card_right__review'>
                            <p>{this.state.theOverview}</p>
                        </div>
                        <div class='card_right__button'>
                            <a href='https://www.youtube.com/watch?v=ot6C1ZKyiME' target='_blank'>WATCH TRAILER</a>
                        </div>
                    </div>
                </div>
            </div>
         


            {/* <div>
            <div>
            <img src={'https://image.tmdb.org/t/p/w500/' + this.state.thePoster}  />
            </div>
            <p>{this.state.theMovie}</p>
            <p>{this.state.theDate}</p>
            <p>{this.state.theOverview}</p>
        </div> */}

            }
        }
        
export default Movie