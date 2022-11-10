import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const Posts = () => {
    const initialPostState = {
        postMessage: ""
    }

    const [posts, setPosts] = useState("");
    const [addPost, setAddPost] = useState(initialPostState);
    const [submitted, setSubmitted] = useState(false);

    const [group, setGroup] = useState("");
    const [selectedGroupValue, setSelectedGroupValue] = useState("");

    const retrieveGroups = () => {
        UserService.getGroups().then(
            (response) => {
                setGroup(response.data);
            },
            (error) => {
                const group =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setGroup(group);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    };

    useEffect(() => {
        retrievePosts();
        retrieveGroups();
    }, []);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setAddPost({ ...addPost, [name]: value });
    };
    const retrievePosts = () => {
        UserService.getPosts().then(
            (response) => {
                setPosts(response.data);
            },
            (error) => {
                const _Posts =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setPosts(_Posts);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    };

    const savePost = () => {

       var data = {
            "postMessage":addPost.postMessage,
            "group":{
            "id":selectedGroupValue
        }
        }
        UserService.savePost(data)
            .then(response => {

                setSubmitted(true);
                console.log(response.data);
                refreshList();
            })
            .catch(e => {
                console.log(e);
            });
    };
    const refreshList = () => {
        retrievePosts();
    };
    return (
        <div className="container">
            <header className="jumbotron">

                <div className="form-group">
                    <label htmlFor="title">Post Something</label>

                    <select onChange={(e)=>setSelectedGroupValue(e.target.value)}>
                        {group &&
                        group.map((cnt, index) => (
                            <option key={index} value={cnt.id}> {cnt.groupName} </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        required
                        value={addPost.postMessage}
                        onChange={handleInputChange}
                        name="postMessage"
                    />
                </div>
                <button onClick={savePost} className="btn btn-success">
                    Submit
                </button>

                <ul className="list-group">
                    {posts &&
                    posts.map((cnt, index) => (
                        <li
                            key={index}
                        >
                            {cnt.postMessage}
                        </li>
                    ))}
                </ul>
            </header>
        </div>
    );
};

export default Posts;
