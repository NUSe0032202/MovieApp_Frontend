import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage, validateYupSchema } from 'formik';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StarRatings from 'react-star-ratings';
import './landing.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';


const BACKEND_API_URL = 'http://localhost:8080/movie'


class landing extends Component {

    state = {
        year: new Date(),
        rating: 0,
        entry: {},
        update: false,
        actors: [""],
        renderError: false,
        errorMsgs: []
    };


    constructor(props) {
        super(props);
        console.log(this.props.location.state);
        //In JavaScript null and undefined is different === Vs ==
        if (!(this.props.location.state == null)) {
            this.state.entry = this.props.location.state;
            this.state.rating = this.props.location.state.movieRating;
            this.state.actors = this.props.location.state.movieActor;
            this.state.update = true;
            //Returned Date Format: yyyy-mm-dd
            var returnedDate = this.props.location.state.movieYear;
            var year = returnedDate.substring(0, 4);
            var month = returnedDate.substring(5, 7);
            var day = returnedDate.substring(8, 10);
            console.log("Year: " + year + " Month " + month + " day" + day);
            this.state.year = new Date(year, month - 1, day);
        }
    }

    handleSubmit = values => {
        console.log(values.title);
        console.log(values.language);
        console.log(values.genre);
        console.log(this.state.year);
        console.log(this.state.rating);
        console.log(this.state.actors);
        //Store the return values in a object
        const entry = {
            movieTitle: values.title,
            movieLanguage: values.language,
            movieGenre: values.genre,
            movieYear: this.state.year,
            movieRating: this.state.rating,
            movieActor: this.state.actors
        };
        if (this.state.update) {
            //this.setState({ update: false });
            return axios.post(`${BACKEND_API_URL}/edit`, entry).then(response => {
                this.setState({ errorMsgs: response.data, renderError: false });
                this.setState({ update: false });
            }).catch(error => {
                this.setState({ errorMsgs: error.response.data, renderError: true });
            }
            );
        } else {
            return axios.post(`${BACKEND_API_URL}/create`, entry).then(response => {
                this.setState({ errorMsgs: response.data, renderError: false });
            }).catch(error => {
                this.setState({ errorMsgs: error.response.data, renderError: true });
            }
            );
        }
    }

    handleChange = date => {
        this.setState({
            year: date
        });
    };

    handleAddActor = () => {
        this.setState({ actors: [...this.state.actors, ""] });
    }

    handleActorChange = (e, index) => {
        this.state.actors[index] = e.target.value;
        //console.log("index: " + index + "value " + e.target.value);
        this.setState({ actors: this.state.actors })
        //console.log("Changed State: " + this.state.actors);
    }

    changeRating = (newRating, name) => {
        this.setState({
            rating: newRating
        });
    }

    handleDelete = (index) => {
        this.state.actors.splice(index, 1);
        this.setState({
            actors: this.state.actors
        });
    }

    render() {

       

        if (sessionStorage.getItem("authorization") == null) {
            return <Redirect to="/" />
        }

        const initVal = {
            title: "",
            language: "English",
            genre: "Action"
        }

        if (this.state.update) {
            initVal.title = this.state.entry.movieTitle;
            initVal.language = this.state.entry.movieLanguage;
            initVal.genre = this.state.entry.movieGenre;
        }
       
        return (
              
            <div className="form" name="form">
              
                <Formik initialValues={initVal}
                    //validate={(values) => {
                    //  let errors = {};
                    // if (!values.title) {
                    //   errors.title = "Movie Title Required";
                    // }

                    // return errors;
                    //}}
                    onSubmit={this.handleSubmit}
                    render={({ values }) =>
                        (<Form>
                            <table className="center">
                                <tbody>
                                    <tr>
                                        <td>
                                            <label>Title</label>
                                        </td>
                                        <td>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td><Field className="title" type="text" name="title"  ></Field></td>
                                                    </tr>
                                                    <tr>
                                                        {/*<td><div style={{ color: 'red' }}><ErrorMessage name="title" /></div></td>*/}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Language</label>
                                        </td>
                                        <td>
                                            <Field className="language" component="select" name="language">
                                                <option value="Engligh">English</option>
                                                <option value="French">French</option>
                                                <option value="German">German</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="Chinese">Chinese</option>
                                            </Field>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Genre</label>
                                        </td>
                                        <td>
                                            <Field className="genre" as="select" name="genre">
                                                <option value="Action">Action</option>
                                                <option value="Comedy">Comedy</option>
                                                <option value="Fantasy">Fantasy</option>
                                                <option value="Romance">Romance</option>
                                                <option value="Thriller">Thriller</option>
                                            </Field>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Year</label>
                                        </td>
                                        <td>
                                            <DatePicker
                                                dateFormat="dd/MM/yyyy"
                                                selected={this.state.year}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Rating</label>
                                        </td>
                                        <td>
                                            <StarRatings
                                                rating={this.state.rating}
                                                starRatedColor="gold"
                                                changeRating={this.changeRating}
                                                numberOfStars={5}
                                                starDimension="30px"
                                                name='rating'
                                                className='rating'
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Actors</label>
                                        </td>
                                        <td>
                                            <table>
                                                <tbody>
                                                    {this.state.actors.map((name, index) => {
                                                        return <tr key={index}><td><Field className="actors" type="text" name="actors" value={name} onChange={(e) => this.handleActorChange(e, index)} />
                                                            <button type="button" onClick={() => this.handleDelete(index)}>Delete</button></td></tr>
                                                    })}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button type="submit" className="submit" name="submit">Add / Save Changes</button>
                                        </td>
                                        <td>
                                            <button type="button" onClick={this.handleAddActor}>Add Actor</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Form>
                        )}
                />
                {this.state.errorMsgs.length > 0 ? <div className={this.state.renderError ? "validations" : "success"} name="validations"><ul>{this.state.errorMsgs.map((i) => <li>{i}</li>)}</ul></div> : null}
            </div>
        );
    }


}

export default landing;
