BLOCK_SIZE_BIG = 20
BLOCK_SIZE_SMALL = 9
EMPTY = 0
SOLID = 1
COLORS = ["#FFFFFF"   # 0 white
          "#000000"   # 1 black
			    "#00CCCC"   # 2 cyan
			    "#AA00AA"   # 3 purple
			    "#EE9900"   # 4 orange
  		    "#5566DD"   # 5 blue
			    "#00AA00"   # 6 green
			    "#DD0000"   # 7 red
			    "#E0E000"]  # 8 yellow

SHAPES = [ # I
           [[0,0,0,0]
            [0,0,0,0]
            [2,2,2,2]
            [0,0,0,0]]
           # T
           [[0,0,0,0]
            [0,0,3,0]
            [0,3,3,0]
            [0,0,3,0]]
           # L
           [[0,0,0,0]
            [0,0,4,0]
            [4,4,4,0]
            [0,0,0,0]]
           # J
           [[0,0,0,0]
            [5,5,5,0]
            [0,0,5,0]
            [0,0,0,0]]
           # S
           [[0,0,0,0]
            [0,6,6,0]
            [6,6,0,0]
            [0,0,0,0]]
           # Z
           [[0,0,0,0]
            [7,7,0,0]
            [0,7,7,0]
            [0,0,0,0]]
           # O
           [[0,0,0,0]
            [0,8,8,0]
            [0,8,8,0]
            [0,0,0,0]]
         ]

drawBlock = (context, x, y, block, size) ->
  if block
    context.shadowOffsetX = size/4;
    context.shadowOffsetY = size/4;
    context.shadowBlur    = 4;
    context.shadowColor   = 'rgba(0, 0, 0, 0.5)';

    context.fillStyle = COLORS[block]
    context.fillRect(x*size, y*size, size, size)

    context.shadowColor   = 'rgba(0, 0, 0, 0)';

    context.fillStyle = 'rgba(0, 0, 0, 0.15)'
    context.fillRect(x*size + size/4, y*size + size/4, size/2, size - size/2)

  # shadows
    context.fillStyle = 'rgba(255,255,255, 0.3)'
    context.fillRect(x*size+1, y*size+1, size/8, size-(size/8))
    context.fillRect(x*size+1, y*size+1, size-(size/8), size/8)

    context.fillStyle = 'rgba(0,0,0, 0.3)'
    context.fillRect((x+1)*size - size/8, y*size + 1, size/8, size - size/8)
    context.fillRect(x*size + 1, (y+1)*size - size/8, size - size/8, size/8)


    context.fillStyle = 'rgba(255,255,255, 0.3)'
    context.fillRect(x*size + size/4, (y+1)*size - size/3, size/2, size/8)
    context.fillRect((x+1)*size - size/3 , y*size + size/4, size/8, size/2)

    context.fillStyle = 'rgba(0,0,0, 0.3)'
    context.fillRect(x*size + size/4, y*size + size/3 - size/8, size/2, size/8)
    context.fillRect(x*size + size/3 - size/8 , y*size + size/4, size/8, size/2)

    context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
    context.strokeRect(x*size, y*size, size, size)


class Field
  constructor: (@numRows, @numCols, @x, @y, @size) ->
    @clear()

  clear: =>
    @field = []
    @addRow(SOLID) # Bottom border
    @addRow(EMPTY) for x in [0...@numRows] # The field

  removeFullLines: =>
    linesRemoved = 0
    for y in [0...@numRows]
      isFull = true
      for x in [0...@numCols]
        if not @getBlock(x, y) then isFull = false
      if isFull
        linesRemoved++
        @delRow(y)
    linesRemoved

  delRow: (n) =>
    @field.splice(n, 1)
    @addRow(EMPTY)

  addRow: (block) =>
    row               = (block for x in [0...@numCols])
    row[0]            = SOLID # Left border
    row[@numCols - 1] = SOLID # Right border
    @field.unshift(row)

  setField: (field) =>
    for y in [0..@numRows]
      for x in [0...@numCols]
        @setBlock(x, y, field[y][x])

  draw: (context) =>
    for y in [0..@numRows]
      for x in [0...@numCols]
        drawBlock(context, @x+x, @y+y, @getBlock(x,y), @size)

  getBlock: (x, y) =>
    @field[y][x]

  setBlock: (x, y, block) =>
    @field[y][x] = block

class Piece
  constructor: (@x, @y, @size, @piece) ->
    @piece ?= @getRandomShape()

  getRandomShape: =>
    i = Math.floor(Math.random()*SHAPES.length)
    SHAPES[i]

  draw: (context) =>
    @foreach (x, y) => drawBlock(context, @x+x, @y+y, @getBlock(x, y), @size)

  rotate: =>
    rotPiece = [[0,0,0,0]
                [0,0,0,0]
                [0,0,0,0]
                [0,0,0,0]]
    @foreach (x, y) => rotPiece[x][3-y] = @getBlock(x,y)
    new Piece(@x, @y, @size, rotPiece)

  getBlock: (x, y) =>
    @piece[y][x]

  isColliding: (field) =>
    for y in [0..3]
      for x in [0..3]
        if @getBlock(x, y) and field.getBlock(@x+x, @y+y)
          return true
    return false

  moveLeft:  => @x--

  moveRight: => @x++

  moveUp:    => @y--

  moveDown:  => @y++

  put: (field) =>
    @foreach (x,y) =>
      if @getBlock(x,y)
        field.setBlock(@x+x, @y+y, @getBlock(x,y))

  foreach: (fun) =>
    for y in [0..3]
      for x in [0..3]
        fun(x, y)

  setPos: (x, y) =>
    @x = x
    @y = y

class Tetris
  constructor: ->
    @initContext()
    @start()
    setInterval(@update, 25)

  initContext: =>
    @canvas                = document.getElementById('canvas')
    @context               = @canvas.getContext('2d')
    document.addEventListener("keydown", @keyDown, false)
    document.addEventListener("keyup", @keyUp, false)

  start: =>
    @key =
      space : false
      left  : false
      up    : false
      right : false
      down  : false
      p     : false
    @running   = true
    @updated   = true
    @ticks     = 0
    @field     = new Field(20, 12,  0,  0, BLOCK_SIZE_BIG)
    @field2    = new Field(20, 12,
      (BLOCK_SIZE_BIG/BLOCK_SIZE_SMALL)*20,  0, BLOCK_SIZE_SMALL)
    @field2.setField(@field.field)
    @piece     = new Piece(4, -1, BLOCK_SIZE_BIG)
    @nextPiece = new Piece(13, 1, BLOCK_SIZE_BIG)

  stop: =>
    @running = false

  update: =>
    @updateInput()
    if @running and @ticks > 10
       @ticks = 0
       @moveDown()
    else
       @ticks++

    @removeFullLines() if @updated
    @draw() if @updated
    @updated = false

  updateInput: =>
    if @key.p       then @togglePause()
    if @running
      if @key.down  then @moveDown()
      if @key.left  then @moveLeft()
      if @key.right then @moveRight()
      if @key.up    then @rotate()
      if @key.space then @drop()


  removeFullLines: =>
    linesRemoved = @field.removeFullLines()

  clear: =>
    @context.clearRect(0, 0, @canvas.width, @canvas.height)

  draw: =>
    @clear()
    @field.draw(@context)
    @field2.draw(@context)
    @piece.draw(@context)
    @nextPiece.draw(@context)

  moveDown: =>
    @updated = true
    @piece.moveDown()
    if @piece.isColliding(@field)
      @piece.moveUp()
      @piece.put(@field)
      @field2.setField(@field.field)
      @piece = @nextPiece
      @piece.setPos(4, -1)
      @nextPiece = new Piece(13, 1, BLOCK_SIZE_BIG)
      if @piece.isColliding(@field)
        @start()
      false
    else
      true

  moveLeft: =>
    @updated = true
    @piece.moveLeft()
    @piece.moveRight() if @piece.isColliding(@field)
    @key.left = false

  moveRight: =>
    @updated = true
    @piece.moveRight()
    @piece.moveLeft() if @piece.isColliding(@field)
    @key.right = false

  rotate: =>
    @updated = true
    rotPiece = @piece.rotate()
    @piece = rotPiece unless rotPiece.isColliding(@field)
    @key.up = false

  drop: =>
    while @moveDown()
      true
    @key.space = false

  togglePause: =>
    @running = not @running
    @key.p = false

  keyDown:   (e) => @keyPushed(e, true)
  keyUp:     (e) => @keyPushed(e, false)

  keyPushed: (e, state) =>
    switch e.keyCode
      when 32 then @key.space = state
      when 37 then @key.left  = state
      when 38 then @key.up    = state
      when 39 then @key.right = state
      when 40 then @key.down  = state
      when 80 then @key.p     = state

load = -> tetris = new Tetris()
window.addEventListener('load', load, false)
