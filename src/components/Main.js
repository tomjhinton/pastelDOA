
import React from 'react'
import 'bulma'
import {Spring} from 'react-spring/renderprops'


const scores = []



class Main extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      height: 425,
      width: 640,
      playing: true,
      player: {
        height: 50,
        width: 50,
        x: 50,
        y: 100,
        velX: 5,
        velY: 5,
        speed: 2,
        colour: '#'+Math.floor(Math.random()*16777215).toString(16)
      },
      background: '#'+Math.floor(Math.random()*16777215).toString(16),
      score: 0,
      highscore: 0,
      gamesPlayed: 0,
      scoreAverage: []
    }


    this.checkKey = this.checkKey.bind(this)
    this.update = this.update.bind(this)
    this.random = this.random.bind(this)
    this.reset = this.reset.bind(this)
    this.up = this.up.bind(this)
    this.down = this.down.bind(this)
    this.left = this.left.bind(this)
    this.right = this.right.bind(this)
    this.touchControl = this.touchControl.bind(this)


  }

  draw(){

    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 0.2
    ctx.fillStyle = this.state.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = this.state.player.colour
    ctx.beginPath()
    ctx.rect(this.state.player.x, this.state.player.y, this.state.player.width ,this.state.player.height)
    ctx.fill()
    ctx.stroke()

  }


  update(){
    const player  = this.state.player
    const canvas = document.getElementById('canvas')

    if(this.state.playing){
      this.setState({ player: {...player,
        x: player.x +player.velX,
        y: player.y+player.velY
      } })

    }

    if(player.y >= this.state.height-player.height){

      canvas.classList.remove('spin')
      this.setState( {playing: false })

    } else if(player.y <= 0){
      canvas.classList.remove('spin')
      this.setState( {playing: false })

    }else if(player.x >= this.state.width-player.width){
      canvas.classList.remove('spin')
      this.setState( {playing: false })
    } else if(player.x <= 0){
      canvas.classList.remove('spin')
      this.setState( {playing: false })

    }


    if(this.state.score %10 === 0 && this.state.score >0){
      this.random()
      this.setState( {player: {...this.state.player,speed: this.state.player.speed+0.1} })
    }


    if(this.state.score >this.state.highscore ){
      const score = document.getElementById('score')
      score.classList.add('pulsate')
    }

    this.draw()
  }


  random(){
    this.setState({ player: {...this.state.player, colour: '#'+Math.floor(Math.random()*16777215).toString(16),height: (Math.floor(Math.random() * 5+ 5)*10), width: (Math.floor(Math.random() * 5+ 5)*10) }, background: '#'+Math.floor(Math.random()*16777215).toString(16) })
  }

  componentDidMount() {
    const canvas = document.getElementById('canvas')
    document.addEventListener('keydown', this.checkKey)
    canvas.addEventListener('touchstart', this.touchControl)
    this.interval2 = setInterval(() => {

      this.update()
    }, 100)

    this.interval2 = setInterval(() => {
      if(this.state.playing){
        this.setState( {score: this.state.score+1 })
      }
    }, 1000)



  }

  checkKey(e) {
    e = e || window.event
    e.preventDefault()


    if (e.keyCode === 38 || e.keyCode === 32) {
      // up arrow
      this.up()

    }else if (e.keyCode === 40) {
      // down arrow
      this.down()

    } else if (e.keyCode === 37) {
      // left arrow

      this.left()



    }else if (e.keyCode === 39) {
      // right arrow
      this.right()


    }else if (e.keyCode === 82) {
      //R
      this.reset()
    }
  }

  up(){
    this.setState({ player: {...this.state.player, velY: -this.state.player.speed*2 } })

    this.draw()
  }

  down(){
    this.setState({ player: {...this.state.player, velY: +this.state.player.speed*2 } })
    this.draw()
  }

  left(){
    if (this.state.player.velX > -this.state.player.speed) {
      this.setState({ player: {...this.state.player, velX: -this.state.player.speed*2 } })
      this.draw()
    }
  }

  right(){
    if (this.state.player.velX < this.state.player.speed) {
      this.setState({ player: {...this.state.player, velX: +this.state.player.speed*2 } })
      this.draw()
    }

  }

  touchControl(e){
    const canvas = document.getElementById('canvas')

    if(e.touches[0].pageY-canvas.getBoundingClientRect().y > this.state.player.y ){
      this.down()

    }

    if(e.touches[0].pageY-canvas.getBoundingClientRect().y < this.state.player.y){
      this.up()
    }


    if(e.touches[0].pageX-canvas.getBoundingClientRect().x > this.state.player.x ){
      this.right()

    }

    if(e.touches[0].pageX-canvas.getBoundingClientRect().x < this.state.player.x){
      this.left()
    }


  }

  reset(){
    const score = document.getElementById('score')
    console.log(this.state)
    score.classList.remove('pulsate')
    scores.push(this.state.score)
    if(this.state.score  >  this.state.highscore){
      this.setState( {highscore: this.state.score, score: 0 })
    }
    if(this.state.score  <=this.state.highscore){
      this.setState( {score: 0 })
    }

    this.setState( {player: {...this.state.player,
      speed: 2,
      x: 50,
      y: 100,
      velX: 5,
      velY: 5
    },
    scores: [...scores],
    gamesPlayed: this.state.gamesPlayed+1 })
    this.props.onChange(this.state)
    this.setState( {playing: true })
    const canvas = document.getElementById('canvas')
    canvas.classList.add('spin')
  }

  render(){

    return(

      <div className="container" onKeyDown={this.checkKey}>
        <div id='score' className="score"> {this.state.score}</div>
        {!this.state.playing  && <div className="pulsate" onClick={this.reset}> R TO RESET</div>}
        <canvas id="canvas" width={640} height={425} onKeyDown={this.checkKey}  className="spin"/>
      </div>
    )
  }
}



export default Main
