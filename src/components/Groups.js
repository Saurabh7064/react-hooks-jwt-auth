import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const Groups = () => {

    const initialGroupState = {
        groupName: ""
    }
    const [group, setGroup] = useState("");
    const [addGroup, setAddGroup] = useState(initialGroupState);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setAddGroup({ ...addGroup, [name]: value });
    };

    const saveGroup = () => {
        var data = {
            groupName: addGroup.groupName,
        };

        UserService.saveGroup(addGroup.groupName)
            .then(response => {

                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const newGroup = () => {
        setAddGroup(initialGroupState);
        setSubmitted(false);
    };

    useEffect(() => {
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
    }, []);

    return (
        <div className="container">
            <header className="jumbotron">
               {/* <h3>{group}</h3>*/}
                {/*<ul>*/}
                {/*    {group.map((cnt)=>(*/}
                {/*        <li>cnt.groupName</li>*/}
                {/*        ))}*/}
                {/*</ul>*/}

                <ul className="list-group">
                    {group &&
                    group.map((cnt, index) => (
                        <li
                            key={index}
                        >
                            {cnt.groupName}
                        </li>
                    ))}
                </ul>
            </header>

            <div className="form-group">
                <label htmlFor="title">Group Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    required
                    value={addGroup.groupName}
                    onChange={handleInputChange}
                    name="groupName"
                />
            </div>
            <button onClick={saveGroup} className="btn btn-success">
                Submit
            </button>
        </div>
    );
};

export default Groups;
