import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const Posts = () => {
    const initialPostState = {
        postMessage: "",
        hasFile: "false"
    }

    //array
    const [posts, setPosts] = useState("");
    const [addPost, setAddPost] = useState(initialPostState);
    const [submitted, setSubmitted] = useState(false);

    const [group, setGroup] = useState("");
    const [selectedGroupValue, setSelectedGroupValue] = useState("3");

    //upload files
        const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [fileInfos, setFileInfos] = useState([]);




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
    }, [submitted]); //this will execute retrieve posts and groups

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

    const deletePost = (index) => {
            UserService.deletePost(index).then(
                (response) => {
                    console.log("deleted");
                    refreshList();
                },
                (error) => {
                    const _Posts =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    if (error.response && error.response.status === 401) {
                        EventBus.dispatch("logout");
                    }
                }
            );
    }

    const savePost = () => {
        debugger;
        if (addPost.postMessage === '' && selectedFiles[0].name.length<1) {
            alert("Post message is required");
            return;
        }

        if(selectedFiles!=undefined && selectedFiles[0].name.length>1){
            addPost.postMessage=selectedFiles[0].name;
            addPost.hasFile="true"
        }

        var data = {
            "postMessage":addPost.postMessage,
            "hasFile":addPost.hasFile,
            "group":{
                "id":selectedGroupValue
            }
        }
        if(selectedFiles!=undefined && selectedFiles[0].name.length>1)
        upload();
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
        retrieveGroups();
    };

    //upload files
    const selectFile = (event) => {
        setSelectedFiles(event.target.files);
    };

    const upload = () => {
        debugger;
        let currentFile = selectedFiles[0];

        setProgress(0);
        setCurrentFile(currentFile);

        UserService.upload(currentFile, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
            .then((response) => {
                setMessage(response.data.message);
                return UserService.getFiles();
            })
            .then((files) => {
                setFileInfos(files.data);
            })
            .catch(() => {
                setProgress(0);
                setMessage("Could not upload the file!");
                setCurrentFile(undefined);
            });

        setSelectedFiles(undefined);
    };



    return (
        <div className="container">
            <header className="jumbotron">

                <div className="form-group">
                    <h2 >Post Something</h2>
                    <label htmlFor="title">Select Group</label>

                    <select onChange={(e)=>setSelectedGroupValue(e.target.value)}>
                        {group &&
                        group.map((cnt, index) => (
                            <option key={index} value={cnt.id}> {cnt.groupName} </option>

                            ))}
                    </select>
                    <label htmlFor="title">What's on your mind?</label>

                    <textarea
                        type="text"
                        className="form-control"
                        id="title"
                        required
                        value={addPost.postMessage}
                        onChange={handleInputChange}
                        name="postMessage"
                    />
                               {/*file upload starts*/}
                    <div>
                        {currentFile && (
                            <div className="progress">
                                <div
                                    className="progress-bar progress-bar-info progress-bar-striped"
                                    role="progressbar"
                                    aria-valuenow={progress}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{ width: progress + "%" }}
                                >
                                    {progress}%
                                </div>
                            </div>
                        )}

                        <label className="btn btn-default">
                            <input type="file" onChange={selectFile} />
                        </label>

                        {/*<div className="alert alert-light" role="alert">*/}
                        {/*    {message}*/}
                        {/*</div>*/}

                        {/*<div className="card">*/}
                        {/*    <div className="card-header">List of Files</div>*/}
                        {/*    <ul className="list-group list-group-flush">*/}
                        {/*        {fileInfos &&*/}
                        {/*        fileInfos.map((file, index) => (*/}
                        {/*            <li className="list-group-item" key={index}>*/}
                        {/*                <a href={file.url}>{file.name}</a>*/}
                        {/*            </li>*/}
                        {/*        ))}*/}
                        {/*    </ul>*/}
                        {/*</div>*/}
                    </div>
                    {/*file upload ends*/}

                </div>
                <button  onClick={savePost} className="btn btn-success">
                    Post...
                </button>

                {/*Post message display*/}

                <ul className="list-group">
                    {posts &&
                    posts.map((cnt, index) => (

                        <li key={index} >

                            {cnt.postMessage &&(
                                cnt.postMessage
                            )}
                            {cnt.url &&(
                                <a href={cnt.url}>Download</a>
                            )}
                            <button onClick={() => deletePost(cnt.id)} className="btn btn-danger">Delete</button>

                        </li>
                    ))}
                </ul>
            </header>
        </div>
    );
};

export default Posts;
