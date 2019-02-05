var ReadPacket = React.createClass({
    getInitialState: function() {
        return {
          nextEventTime: null,
          countdownText: null,
          animation: false,
          status: -1, // -1: cd, 0: 等待拆开 1: 拆开后, 2: 拆开后 - 失败
          message: null,
        };
    },
    componentDidMount() {
      this.getEventStatus();
    },
    stopAnimation: function() {
        this.setState({animation: false});
    },
    getEventStatus: function getEventStatus(){
      fetch("https://www.cmapi.ca/cm_backend/index.php/api/checkout/v1/get_status")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          const status = result.nleft > 0;
          const next_start = result.next_start;
          this.setState({
            status: {true: 0, false: -1}[status],
            nextEventTime: next_start,
          });
          if (!status){
            this.tick();
            this.intervalHandle = setInterval(this.tick, 1000);
          }
        },
        (error) => {}
      )
    },
    openRedPacket: function() {
      if (this.state.animation){
        return;
      }
      const phone = prompt("请输入领取奖励的手机号码");
      if (!phone || phone.length != 10){
        alert("手机号码格式错误")
        return;
      }

      this.setState({animation: true});
      fetch("https://www.cmapi.ca/cm_backend/index.php/api/checkout/v1/try_luck", {
        body: JSON.stringify({cellphone: phone}),
        method: 'POST',
      })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          const isHit = result.hit;
          const message = result.message;

          // animation
          setTimeout(this.stopAnimation.bind(this), 3000);
          setTimeout(() => {
            this.setState({
              status: {true: 1, false: 2}[isHit],
              message: message,
            });
          }, 3000)
        },
        (error) => {}
      )
    },
    tick() {

      const current = Math.floor(Date.now() / 1000);
      let secondsRemaining = this.state.nextEventTime - current;

      var hrs = Math.floor(secondsRemaining / 3600);
      var min = Math.floor(secondsRemaining / 60) % 60;
      var sec = Math.floor(secondsRemaining % 60);
      this.setState({
        countdownText: `${hrs}:${min}:${sec}`
      })
      if (min === 0 & sec === 0) {
        clearInterval(this.intervalHandle);
        location.reload();
      }
    },
    render: function() {
        if(this.state.status == -1) {
            return (
                <div className='redpack-container' id='redpack-container'>
                    <div className='redpack'>
                        <div className='topcontent'>
                            <div className='redpack-avatar'>
                                <img src='./assets/avatar.png' alt='头像' width='80' height='80'/>
                            </div>
                            <h2 className='white-text'>馋猫2019红包雨</h2>
                            <span className='redpack-text'>本轮红包已经抢完</span>
                            <div className='redpack-description white-text'>下一轮倒计时</div>
                        </div>

                        <div id='redpack-open' className={this.state.animation ? 'rotate' : ''}
                        >
                            <span>{this.state.countdownText}</span>
                        </div>
                    </div>
                </div>
            );
        }
        else if(this.state.status == 0) {
            return (
                <div className='redpack-container' id='redpack-container'>
                    <div className='redpack'>
                        <div className='topcontent'>
                            <div className='redpack-avatar'>
                                <img src='./assets/avatar.png' alt='头像' width='80' height='80'/>
                            </div>
                            <h2 className='white-text'>馋猫</h2>
                            <span className='redpack-text'>给你发了一个红包</span>
                            <div className='redpack-description white-text'>恭喜发财 大吉大利</div>
                        </div>

                        <div id='redpack-open' className={this.state.animation ? 'rotate' : ''}
                             onClick={this.openRedPacket.bind(this)}
                        >
                            <span>拆红包</span>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.status == 2) {
            // 谢谢参与
            return (
                <div className='redpack-container' id='redpack-container'>
                    <div className='redpack'>
                        <div className='topcontent-open'>
                            <div className='redpack-avatar'>
                                <span id='close'></span>
                            </div>
                            <h1 className='white-text' style={{marginTop: 180}}> 您没有抢到红包 </h1>
                            <span className='redpack-text'>{this.state.message}</span>
                            <div>
                            </div>
                        </div>

                        <div id='redpack-opened'>
                            <div className='redpack-avatar'>
                                <img src='./assets/avatar.png' alt='头像' width='80' height='80'/>
                            </div>
                        </div>

                    </div>
                </div>
            );
        } else {
            // 显示奖励金额
            return (
                <div className='redpack-container' id='redpack-container'>
                    <div className='redpack'>
                        <div className='topcontent-open'>
                            <div className='redpack-avatar'>
                                <span id='close'></span>
                            </div>
                            <h1 className='white-text' style={{marginTop: 180}}> 恭喜您 </h1>
                            <span className='redpack-text'></span>
                            <div>
                                <a className='white-text'>
                                    {this.state.message}
                                </a>
                            </div>
                        </div>

                        <div id='redpack-opened'>
                            <div className='redpack-avatar'>
                                <img src='./assets/avatar.png' alt='头像' width='80' height='80'/>
                            </div>
                        </div>

                    </div>
                </div>
            );
        }
    }
});
