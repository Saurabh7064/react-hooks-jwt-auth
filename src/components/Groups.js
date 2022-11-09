import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const Groups = () => {
    const [content, setContent] = useState("");

    useEffect(() => {
        UserService.getGroups().then(
            (response) => {
                setContent(response.data);
                debugger;
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setContent(_content);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, []);

    return (
        <div className="container">
            <header className="jumbotron">

                <ul className="list-group">
                    {content &&
                    content.map((cnt, index) => (
                        <li
                            key={index}
                        >
                            {cnt.groupName}
                        </li>
                    ))}
                </ul>
            </header>
        </div>
    );
};

export default Groups;
