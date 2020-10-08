import React, { Component } from 'react';
import axios from 'axios'
import {withRouter } from 'react-router-dom';
import ReactTable from "react-table";
import "react-table/react-table.css";
import StarRatings from 'react-star-ratings';
import { Redirect } from 'react-router-dom'

const BACKEND_API_URL = 'http://localhost:8080/movie'

class View extends Component {



    constructor(props) {
        super(props);
        this.state = {
            query: "",
            filtered: [],
            entries: [],
            selectedRow: -1,
            category: "Genre"
        };
    }



    handleChange = event => {
        //const query = event.target.value;
        this.setState({ query: event.target.value });
    }

    handleCatChange = e => {
        console.log(e.target.value);
        this.setState({
            category: e.target.value
        })
    }


    onDeleteRow = () => {
        var toDelete = this.state.entries[this.state.selectedRow].movieTitle;
        axios.post(`${BACKEND_API_URL}/delete`, toDelete, { headers: { 'content-type': 'text/plain' } }).then(response => {
            axios.get(`${BACKEND_API_URL}/entries`).then(
                res => {
                    const entry = res.data;
                    this.setState({ entries: entry });
                }
            )
        });
    }

    onEditRow = () => {
        this.props.history.push({ pathname: '/Entry', state: this.state.entries[this.state.selectedRow] });
    }

    onRowClick = (state, rowInfo, column, instance) => {
        if (typeof rowInfo !== "undefined") {
            return {
                onClick: e => {
                    this.setState({
                        selectedRow: rowInfo.index
                    });

                }, style: {
                    background: rowInfo.index === this.state.selectedRow ? '#9bdfff' : 'white'

                }
            }
        } else {
            return {
                onClick: e => {

                }, style: {
                    background: 'white'
                }
            }
        }
    }


    //Method would be called post-render
    // Not recommended to call setstate here as it would trigger the re-render, has exceptions 
    // like then block after a promise 
    componentDidMount() {
        axios.get(`${BACKEND_API_URL}/entries`).then(
            res => {
                const entry = res.data;
                this.setState({ entries: entry });
            }
        )
    }

    toYear = (date) => {
        return date.substring(0, 4);
    }

    format = (actors) => {
        return (
            actors.map(i => <tr><td>{i}</td></tr>)
        );
    }

    formatStar = (rating) => {

        return (<StarRatings
            rating={rating}
            starDimension="20px"
            starRatedColor="gold"
        />);
    }

    render() {

        if(sessionStorage.getItem("authorization")==null){
            return <Redirect to="/"/>
        }

        let dat = this.state.entries
        if (this.state.query) {
            if (this.state.category === "Genre") {
                dat = dat.filter(row => {
                    return row.movieGenre.includes(this.state.query)
                });
            }
            if (this.state.category === "Title") {
                dat = dat.filter(row => {
                    return row.movieTitle.includes(this.state.query)
                });
            }
            if (this.state.category === "Actor") {
                dat = dat.filter(row => {
                    return row.movieActor.some(e => e.includes(this.state.query))
                });

            }
            if (this.state.category === "Year") {
                dat = dat.filter(row => {
                    return row.movieYear.substring(0, 4) === this.state.query
                });

            }
        }

        const column = [{
            Header: 'Title',
            accessor: 'movieTitle',
            style: {
                textAlign: 'center'
            }

        }, {

            Header: 'Genre',
            accessor: 'movieGenre',
            style: {
                textAlign: 'center'
            }

        }, {

            Header: 'Language',
            accessor: 'movieLanguage',
            style: {
                textAlign: 'center'
            }

        }, {
            Header: 'Year',
            accessor: 'movieYear',
            style: {
                textAlign: 'center'
            },
            Cell: props => <React.Fragment>{this.toYear(props.value)}</React.Fragment>

        }, {
            Header: 'Rating',
            accessor: 'movieRating',
            style: {
                textAlign: 'center'
            },
            Cell: props => <React.Fragment>{this.formatStar(props.value)}</React.Fragment>

        }, {
            Header: 'Actors',
            accessor: 'movieActor',
            Cell: props => <React.Fragment><table>{this.format(props.value)}</table></React.Fragment>
        }]

        return (

            <div className="search" >
                <label>Search </label>
                <input className="input" name="input" id="input" type="text" onChange={this.handleChange} value={this.state.query} ></input>
                <select name="criteria" id="criteria" onChange={this.handleCatChange}>
                    <option value="Genre">Genre</option>
                    <option value="Actor">Actor</option>
                    <option value="Title">Title</option>
                    <option value="Year">Year</option>
                </select>
                <div>

                </div>
                <div>
                    <ReactTable data={dat}
                        columns={column} pageSizeOptions={[2, 4, 6]} getTrProps={this.onRowClick} />
                    <button type="button" onClick={this.onDeleteRow} className="delete" name="delete">Delete Row</button>
                    <button type="button" onClick={this.onEditRow} className="edit" name="edit">Edit Row</button>
                </div>

            </div>
        );


    }


}

export default withRouter(View);