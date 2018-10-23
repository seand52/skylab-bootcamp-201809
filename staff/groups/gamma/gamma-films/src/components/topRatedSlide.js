import React, { Component } from 'react'
import logic from '../logic'
import MiniCard from './MiniCard'


class TopRatedSlide extends Component {
    state = {
        error: '',
        movies: [],
        flag: true

    }

    handleSearch = this.handleSearch.bind(this)

    handleSearch(date) {
        try {
            logic.searchPopularMovies(date)
                .then(movies => this.setState({ movies }))
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }
        this.setState({ flag: false })
    }
        


    render() {
        return <div class="contain">
            {this.state.flag && this.handleSearch("week")}
            <div class="row">
                <h4>Popular movies</h4>
                <div class="row__inner">
                    {this.state.movies.map((film, index) => {
                        return <MiniCard title={film.title} description={film.overview} release={film.release_date} imgRoute={film.poster_path} id={film.id} onCardClick={this.handleCardClick} />
                    })}
                </div>
            </div>
        </div>

    }
}

export default TopRatedSlide