var ReadPacket = React.createClass({
    displayName: "ReadPacket",

    getInitialState: function () {
        return {
            nextEventTime: null,
            countdownText: null,
            animation: false,
            status: -1, // -1: cd, 0: 等待拆开 1: 拆开后, 2: 拆开后 - 失败
            message: null,
            phone: null
        };
    },
    componentDidMount() {
        this.phoneChanged = this.phoneChanged.bind(this);
        this.getEventStatus();
    },
    stopAnimation: function () {
        this.setState({ animation: false });
    },
    getEventStatus: function getEventStatus() {
        fetch("https://www.cmapi.ca/cm_backend/index.php/api/checkout/v1/get_status_hm").then(res => res.json()).then(result => {
            // console.log(result);
            const status = result.nleft > 0;
            const next_start = result.next_start;
            this.setState({
                status: { true: 0, false: -1 }[status],
                nextEventTime: next_start
            });
            if (!status) {
                this.tick();
                this.intervalHandle = setInterval(this.tick, 1000);
            }
        }, error => {});
    },
    phoneChanged(value) {
        this.setState({
            phone: event.target.value
        });
    },
    openRedPacket: function () {
        if (this.state.animation) {
            return;
        }
        const phone = this.state.phone;
        if (!phone || phone.length != 10) {
            alert("手机号码格式错误");
            return;
        }

        this.setState({ animation: true });
        fetch("https://www.cmapi.ca/cm_backend/index.php/api/checkout/v1/try_luck_hm", {
            body: JSON.stringify({ cellphone: phone }),
            method: "POST"
        }).then(res => res.json()).then(result => {
            console.log(result);
            const isHit = result.hit;
            const message = result.message;

            // animation
            setTimeout(this.stopAnimation.bind(this), 3000);
            setTimeout(() => {
                this.setState({
                    status: { true: 1, false: 2 }[isHit],
                    message: message
                });
            }, 3000);
        }, error => {});
    },
    tick() {

        const current = Math.floor(Date.now() / 1000);
        let secondsRemaining = this.state.nextEventTime - current;

        var hrs = Math.floor(secondsRemaining / 3600);
        var min = Math.floor(secondsRemaining / 60) % 60;
        var sec = Math.floor(secondsRemaining % 60);
        this.setState({
            countdownText: `${hrs}:${min}:${sec}`
        });
        if (min === 0 & sec === 0) {
            clearInterval(this.intervalHandle);
            location.reload();
        }
    },
    render: function () {
        if (this.state.status == -1) {
            return React.createElement(
                "div",
                { className: "redpack-container", id: "redpack-container" },
                React.createElement(
                    "div",
                    { className: "redpack" },
                    React.createElement(
                        "div",
                        { className: "topcontent" },
                        React.createElement(
                            "div",
                            { className: "redpack-avatar" },
                            React.createElement("img", { src: "./assets/avatar.png", alt: "\u5934\u50CF", width: "80", height: "80" })
                        ),
                        React.createElement(
                            "h2",
                            { className: "white-text" },
                            "\u998B\u732B\u7EA2\u5305\u96E8"
                        ),
                        React.createElement(
                            "span",
                            { className: "redpack-text" },
                            "\u672C\u8F6E\u7EA2\u5305\u5DF2\u7ECF\u62A2\u5B8C"
                        ),
                        React.createElement(
                            "div",
                            { className: "redpack-description white-text" },
                            "\u4E0B\u4E00\u8F6E\u5012\u8BA1\u65F6"
                        )
                    ),
                    React.createElement(
                        "div",
                        { id: "redpack-open", className: this.state.animation ? 'rotate' : ''
                        },
                        React.createElement(
                            "span",
                            null,
                            this.state.countdownText
                        )
                    )
                )
            );
        } else if (this.state.status == 0) {
            return React.createElement(
                "div",
                { className: "redpack-container", id: "redpack-container" },
                React.createElement(
                    "div",
                    { className: "redpack" },
                    React.createElement(
                        "div",
                        { className: "topcontent" },
                        React.createElement(
                            "div",
                            { className: "redpack-avatar" },
                            React.createElement("img", { src: "./assets/avatar.png", alt: "\u5934\u50CF", width: "80", height: "80" })
                        ),
                        React.createElement(
                            "h2",
                            { className: "white-text" },
                            "\u998B\u732B"
                        ),
                        React.createElement(
                            "span",
                            { className: "redpack-text" },
                            "\u7ED9\u4F60\u53D1\u4E86\u4E00\u4E2A\u7EA2\u5305"
                        ),
                        React.createElement(
                            "div",
                            { className: "redpack-description white-text" },
                            React.createElement("input", { type: "text", placeholder: "\u8F93\u5165\u624B\u673A\u53F7\u53C2\u4E0E\u62BD\u5956", value: this.state.phone, onChange: this.phoneChanged })
                        )
                    ),
                    React.createElement(
                        "div",
                        { id: "redpack-open", className: this.state.animation ? 'rotate' : '',
                            onClick: this.openRedPacket.bind(this)
                        },
                        React.createElement(
                            "span",
                            null,
                            "\u62C6\u7EA2\u5305"
                        )
                    )
                )
            );
        } else if (this.state.status == 2) {
            // 谢谢参与
            return React.createElement(
                "div",
                { className: "redpack-container", id: "redpack-container" },
                React.createElement(
                    "div",
                    { className: "redpack" },
                    React.createElement(
                        "div",
                        { className: "topcontent-open" },
                        React.createElement(
                            "div",
                            { className: "redpack-avatar" },
                            React.createElement("span", { id: "close" })
                        ),
                        React.createElement(
                            "h1",
                            { className: "white-text", style: { marginTop: 180 } },
                            " \u60A8\u6CA1\u6709\u62A2\u5230\u7EA2\u5305 "
                        ),
                        React.createElement(
                            "span",
                            { className: "redpack-text" },
                            this.state.message
                        ),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        { id: "redpack-opened" },
                        React.createElement(
                            "div",
                            { className: "redpack-avatar" },
                            React.createElement("img", { src: "./assets/avatar.png", alt: "\u5934\u50CF", width: "80", height: "80" })
                        )
                    )
                )
            );
        } else {
            // 显示奖励金额
            return React.createElement(
                "div",
                { className: "redpack-container", id: "redpack-container" },
                React.createElement(
                    "div",
                    { className: "redpack" },
                    React.createElement(
                        "div",
                        { className: "topcontent-open" },
                        React.createElement(
                            "div",
                            { className: "redpack-avatar" },
                            React.createElement("span", { id: "close" })
                        ),
                        React.createElement(
                            "h1",
                            { className: "white-text", style: { marginTop: 180 } },
                            " \u606D\u559C\u60A8 "
                        ),
                        React.createElement("span", { className: "redpack-text" }),
                        React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "a",
                                { className: "white-text" },
                                this.state.message
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { id: "redpack-opened" },
                        React.createElement(
                            "div",
                            { className: "redpack-avatar" },
                            React.createElement("img", { src: "./assets/avatar.png", alt: "\u5934\u50CF", width: "80", height: "80" })
                        )
                    )
                )
            );
        }
    }
});