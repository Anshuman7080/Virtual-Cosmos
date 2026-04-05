import { useEffect, useRef, useCallback } from 'react'
import * as PIXI from 'pixi.js'
import { WORLD_WIDTH, WORLD_HEIGHT, PROXIMITY_RADIUS, MOVE_SPEED, AVATAR_COLORS } from '../utils/constants'

export default function CosmosCanvas({ myUser, otherUsers, onMove, proximityConnections }) {
  const containerRef = useRef(null)
  const appRef = useRef(null)
  const mySprite = useRef(null)
  const otherSprites = useRef(new Map()) 
  const keysRef = useRef(new Set())
  const myPosRef = useRef(myUser?.position || { x: 400, y: 300 })
  const lastEmitRef = useRef(0)

 
  const myUserRef = useRef(myUser)
  useEffect(() => { myUserRef.current = myUser }, [myUser])

 
  const createAvatar = useCallback((avatarIdx, username, isMe = false) => {
    const colors = AVATAR_COLORS[avatarIdx % AVATAR_COLORS.length]
    const container = new PIXI.Container()

    // Proximity ring
    const ring = new PIXI.Graphics()
    ring.lineStyle(1.5, colors.body, 0.3)
    ring.drawCircle(0, 0, PROXIMITY_RADIUS)
    ring.visible = isMe
    container.addChild(ring)
    container.proximityRing = ring

    
    const aura = new PIXI.Graphics()
    aura.beginFill(colors.body, 0.12)
    aura.drawCircle(0, 0, 28)
    aura.endFill()
    aura.visible = false
    container.addChild(aura)
    container.aura = aura

    
    const body = new PIXI.Graphics()
    body.beginFill(colors.body, 0.9)
    body.lineStyle(2.5, colors.outline, 1)
    body.drawCircle(0, 0, 18)
    body.endFill()
    container.addChild(body)

    // Inner face detail
    const face = new PIXI.Graphics()
    face.beginFill(0x050714, 1)
    face.drawCircle(-6, -3, 3)
    face.drawCircle(6, -3, 3)
    face.endFill()
    face.beginFill(0xffffff, 1)
    face.drawCircle(-5, -4, 1.2)
    face.drawCircle(7, -4, 1.2)
    face.endFill()
    face.lineStyle(1.5, 0x050714, 0.8)
    face.arc(0, 2, 6, 0.1, Math.PI - 0.1)
    container.addChild(face)

    // Crown for "me"
    if (isMe) {
      const crown = new PIXI.Graphics()
      crown.beginFill(0xfbbf24)
      crown.moveTo(-8, -22)
      crown.lineTo(-8, -16)
      crown.lineTo(-4, -19)
      crown.lineTo(0, -15)
      crown.lineTo(4, -19)
      crown.lineTo(8, -16)
      crown.lineTo(8, -22)
      crown.closePath()
      crown.endFill()
      container.addChild(crown)
    }

    const label = new PIXI.Text(isMe ? `${username} (you)` : username, {
      fontFamily: 'Oxanium',
      fontSize: 11,
      fill: isMe ? 0xfbbf24 : colors.body,
      align: 'center',
      dropShadow: true,
      dropShadowDistance: 1,
      dropShadowColor: 0x000000,
      dropShadowAlpha: 0.8,
    })
    label.anchor.set(0.5, 0)
    label.y = 22
    container.addChild(label)

    container._body = body
    container._face = face
    container._label = label

    return container
  }, [])


  useEffect(() => {
    if (!containerRef.current || appRef.current) return

    const app = new PIXI.Application({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: 0x080c1f,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })

    containerRef.current.appendChild(app.view)
    appRef.current = app

   
    const bgContainer = new PIXI.Container()
    app.stage.addChild(bgContainer)

    const grid = new PIXI.Graphics()
    grid.lineStyle(0.5, 0x1a2040, 0.8)
    const gridSize = 80
    for (let x = 0; x <= WORLD_WIDTH; x += gridSize) {
      grid.moveTo(x, 0); grid.lineTo(x, WORLD_HEIGHT)
    }
    for (let y = 0; y <= WORLD_HEIGHT; y += gridSize) {
      grid.moveTo(0, y); grid.lineTo(WORLD_WIDTH, y)
    }
    bgContainer.addChild(grid)

   



    // ─── World container ─────────────────────────────────────────────────────
    const worldContainer = new PIXI.Container()
    app.stage.addChild(worldContainer)
    appRef.current.worldContainer = worldContainer
    appRef.current.camera = { x: 0, y: 0 }

    const me = myUserRef.current
    if (me) {
      const startPos = myPosRef.current
      const avatar = createAvatar(me.avatar, me.username, true)
      avatar.x = startPos.x
      avatar.y = startPos.y
      worldContainer.addChild(avatar)
      mySprite.current = avatar

    
      let floatT = 0
      app.ticker.add(() => {
        floatT += 0.03
        if (avatar._body) avatar._body.y = Math.sin(floatT) * 2
        if (avatar._face) avatar._face.y = Math.sin(floatT) * 2
        if (avatar._label) avatar._label.y = 22 + Math.sin(floatT) * 2
      })
    }


    app.ticker.add(() => {
      otherSprites.current.forEach((sprite) => {
        if (sprite._targetX !== undefined) {
          sprite.x += (sprite._targetX - sprite.x) * 0.15
          sprite.y += (sprite._targetY - sprite.y) * 0.15
        }
      })
    })


    const resize = () => {
      if (!containerRef.current || !appRef.current) return
      app.renderer.resize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      app.destroy(true)
      appRef.current = null
      mySprite.current = null
      otherSprites.current.clear()
    }
  
  }, []) 


  useEffect(() => {
    if (!appRef.current?.worldContainer) return

    const existing = new Set(otherSprites.current.keys())

    otherUsers.forEach((user) => {
      existing.delete(user.userId)

      if (!otherSprites.current.has(user.userId)) {
       
        const avatar = createAvatar(user.avatar, user.username, false)
        avatar.x = user.position.x
        avatar.y = user.position.y
        avatar._targetX = user.position.x
        avatar._targetY = user.position.y
        appRef.current.worldContainer.addChild(avatar)
        otherSprites.current.set(user.userId, avatar)
      } else {
       
        const sprite = otherSprites.current.get(user.userId)
        sprite._targetX = user.position.x
        sprite._targetY = user.position.y
      }
    })


    existing.forEach((userId) => {
      const sprite = otherSprites.current.get(userId)
      if (sprite && appRef.current?.worldContainer) {
        appRef.current.worldContainer.removeChild(sprite)
        otherSprites.current.delete(userId)
      }
    })
  }, [otherUsers, createAvatar])

 
  useEffect(() => {
    otherSprites.current.forEach((sprite, userId) => {
      const connected = proximityConnections.has(userId)
      if (sprite.aura) sprite.aura.visible = connected
    })
  }, [proximityConnections])

 
  useEffect(() => {
    if (!appRef.current?.worldContainer) return

    if (appRef.current.connectionLines) {
      appRef.current.worldContainer.removeChild(appRef.current.connectionLines)
    }

    const lines = new PIXI.Graphics()
    proximityConnections.forEach((_, userId) => {
      const other = otherSprites.current.get(userId)
      if (other && mySprite.current) {
        lines.lineStyle(1, 0x00f5ff, 0.25)
        lines.moveTo(mySprite.current.x, mySprite.current.y)
        lines.lineTo(other.x, other.y)
      }
    })

    appRef.current.worldContainer.addChildAt(lines, 0)
    appRef.current.connectionLines = lines
  }, [proximityConnections, otherUsers])


  useEffect(() => {
    const down = (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].includes(e.key)) {
        e.preventDefault()
        keysRef.current.add(e.key.toLowerCase())
      }
    }
    const up = (e) => keysRef.current.delete(e.key.toLowerCase())
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

 
  useEffect(() => {
    if (!appRef.current) return

    const ticker = appRef.current.ticker
    const moveHandler = () => {
      if (!mySprite.current) return

      const k = keysRef.current
      let dx = 0, dy = 0
      if (k.has('arrowleft') || k.has('a')) dx -= MOVE_SPEED
      if (k.has('arrowright') || k.has('d')) dx += MOVE_SPEED
      if (k.has('arrowup') || k.has('w')) dy -= MOVE_SPEED
      if (k.has('arrowdown') || k.has('s')) dy += MOVE_SPEED

      if (dx === 0 && dy === 0) return

      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707 }

      const newX = Math.max(20, Math.min(WORLD_WIDTH - 20, mySprite.current.x + dx))
      const newY = Math.max(20, Math.min(WORLD_HEIGHT - 20, mySprite.current.y + dy))

      mySprite.current.x = newX
      mySprite.current.y = newY
      myPosRef.current = { x: newX, y: newY }

     
      const app = appRef.current
      const hw = app.renderer.width / 2
      const hh = app.renderer.height / 2
      app.camera.x = Math.max(0, Math.min(WORLD_WIDTH - app.renderer.width, newX - hw))
      app.camera.y = Math.max(0, Math.min(WORLD_HEIGHT - app.renderer.height, newY - hh))
      app.stage.x = -app.camera.x
      app.stage.y = -app.camera.y


      const now = Date.now()
      if (now - lastEmitRef.current > 33) {
        onMove({ x: newX, y: newY })
        lastEmitRef.current = now
      }
    }

    ticker.add(moveHandler)
    return () => {
     
      if (appRef.current?.ticker) {
        ticker.remove(moveHandler)
      }
    }
  }, [onMove])

  return (
    <div
      ref={containerRef}
      id="pixi-canvas-container"
      className="w-full h-full"
      style={{ cursor: 'default' }}
    />
  )
}