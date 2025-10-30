Functional browser based slot machine game build with vanilla JavaScript
and HTML5

Version: 1.0

Author : Dragan Karanikolic

### 

### **Project Overview**

Very Hot 5 is a browser based-functional slot machine game featuring a
5-reel, 3-row grid with animated sprite symbols, multiple winning line
patterns (3 horizontal, 1 diagonal), auto-play functionality, and a
gamble feature for doubling winnings. The game is built entirely in
vanilla JavaScript, HTML5 and CSS3 without any external libraries or
frameworks

### **Key Features**

-   Animated sprite-based symbols with 24-frame animations
-   Multiple winning line detection (horizontal and diagonal)
-   Auto play mode with customizable rounds
-   Responsive design that adapts to different screen sizes
-   Fullscreen support
-   Smooth money transfer animation
-   Session persistence to maintain game state across page reloads
-   Gamble integration for risk/reward gameplay

### **Technologies Used**

-   HTML5 Canvas for rendering game graphics
-   Vanilla JavaScript (ES6+)
-   CSS3 for UI styling
-   SessionStorage API for state persistence
-   RequestAnimationFrame for smooth animations

### **System Requirements**

# **Hardware**

-   Any computer capable of running a modern web browser
-   Minimum 4GB RAM
-   No GPU requirements

# **Software**

-   Modern web browser(Chrome , Firefox, Safari, Edge)
-   Text editor (VSCode , Notepad++ , or any other editor)
-   Optional : Live Server extension for development

### **File Structure**

animacije-root/

| 
|--- main.html # Entry point , contains 3 canvas elements
|--- stil.css # All styling and layout
| 
|--- game.js # Core game logic
|--- animations.js # Animations system
|--- lines.js # Line rendering
|--- events.js # UI event handlers
|--- automode.js # Auto-play logic
|--- resize.js # Responsive handling
| 
|--- symbols/ Static symbol images
|   |
|   |--- 0.png # Symbol type 1 (static)
|   |--- 1.png # Symbol type 2 (static)
|   |--- ...
|
|
|---sprites/Animated sprites sheets
|   |
|   |--- 0.png # Symbol 1 animation (24 frames vertical)
|   |--- 1.png # Symbol 2 animation (24 frames vertical)
|   |--- ...
| 
| 
|--- images/
|   |
|   |--- main-background.png
|   |--- rules.png
| 
| 
|---Zadatak11 # Logic for gamble, entire project for it



 **Module Overview**

Very Hot 5 uses a modular design with 6 JavaScript files that handle

different aspects of the game. The core module (game.js) coordinates

all game logic, while specialized modules handle animations, UI events,

and responsive behavior.

**Module Communication**

- game.js → animations.js: Triggers sprite animations for winners
- animations.js → lines.js: Syncs line clearing with animation end
- resize.js → ALL: Invalidates all ongoing operations on resize
- automode.js ↔ game.js: Schedules repeated spins with smart delays

 

 **Module Responsibilities**

**game.js****

- Symbol generation and positioning
- Win detection algorithm
- Money management ( does not include money management for auto-play)
- SessionStorage integration
- Game state coordination

**animation.js****

- Sprite sheet rendering (24 frames @ 30 FPS)
- Animation lifecycle management
- Spin ID validation
- Anti-overlap protection
- Frame timing control

**lines.js** - Line Rendering

- Drawing winning lines on canvas layers
- Coordinate calculation for line paths
- Animation synchronization with symbols
- Canvas clearing optimization

**automode.js** - Auto Play System

- Round management and counting
- Intelligent delay calculation based on wins
- Balance validation
- Stop condition handling
- Money transfer automation

**events.js** - Event Handlers

- UI button click handlers
- Bet increment/decrement controls
- Number of rounds in auto mode increment/decrement controls
- Screen toggle management (help, auto settings)
- Fullscreen handling

**resize.js** - Responsive System

- Window resize detection
- Canvas dimension recalculation
- DPI scaling for sharp rendering
- Symbol repositioning using normalized coordination's
- UI element scaling

**API Reference(opisati svaki fajl posebno)**



 **game.js**

 

 **Functions**

 

    --drawSlot()--  



     **Description**
     Start a new spin, validates bet amount , validates if player has cash to start a spin, generates random symbols and draws them on   canvas1 and calls function Spoji()

     **Parameters**
      None

     **Returns**
      void

     **Side Effects**
    - Increments currentSpinID
    - Stops animations from previous spins and clears "AktivneAnimacije" map
    - Updates "drawSymbol" array
    - Clears "dobitneLinije" & "dobiteLinije2" arrays
    - Clears all canvas's before generating new symbol grid 
    - Calls function Spoji() at the and of its body after 200ms

     **Example**
     dugme.onclick=()=> drawSlot() (inside setButtonStart())



     --Spoji(reads from "drawSymbols[]")--

    **Description**
    Detects winning combinations on 4 pay lines (3 horizontal + 1 diagonal), calculates payouts, and handles post-spin flow (animations, money transfer, button states).

    **Parameters**
    None

    **Returns**
    void

    **Algorithm**
    1. Deduct bet immediately
    2. Check horizontal lines: compare first symbol with next 4 in each row (min 3 matches) → store in `dobitneLinije[]`
    3. Check diagonal: indices 0→6→12 (extendable to 8, 4) → store in `dobitneLinije2[]`
    4. Calculate payout using symbol value × bet × multiplier
    5. If wins: trigger animations, wait 2800ms, then transfer money or enable "Take Win" button
    6. If no wins and auto mode: schedule next spin

    **Side Effects**
    - Populates `dobitneLinije[]` and `dobitneLinije2[]`
    - Updates balance and win display
    - Calls "pokreniAnimacijuSvih()" for animations
    - Enables/disables spin and gamble buttons
    - Triggers "MoneyTransferAuto()" if auto mode or "setButtonTakeWin()" (manual)

     **Example**
    drawSlot() {
        ...
     Spoji(); // Detect wins and handle payout
    }


    --SetButtonStart()--

    **Description**
    Resets the spin button to default "Start" state after a win has been collected. Removes "Take Win" styling and re-enables normal spin functionality.

    **Parameters**
    None

    **Returns**
    void

    **Side Effects**
    - Removes "takeWin" CSS class from the button (dugme)
    - Sets button text to Start  (dugme)
    - Calls "stopAllAnimationsAndFreeze()" for animations
    - OnClick it calls "drawSlot()"
    

     **Example**
    moneyTransfer(amount,callback) {
        ...
     SetButtonStart(); // Detect wins and handle payout
    }

    --SetButtonTakeWin(amount)--

    **Description**
    Resets the spin button to "TakeWin" state after a win has been detected. Removes "Start" styling.

    **Parameters**
    `amount`- Winning amount to be transferred

    **Returns**
    void

    **Side Effects**
    - Removes "disabled" CSS class from the spin button (dugme)
    - Adds "takeWin" CSS class to the spin button (dugme)
    - Sets spin button text to "TakeWin" (dugme)
    - OnClick it calls "MoneyTransfer()" and adds CSS class "disabled"
 

     **Example**
      Spoji() {
	....
        if (autoMode) {
                MoneyTransferAuto(win);
            } else {
                if(win<=gambleLimit){
                    gambleBtn.classList.remove("disabled");
                }
                setButtonTakeWin(win);
            }    
	}
	
    --MoneyTransfer(amount,callback)--

    **Description**
    Draws a static symbol image on canvas with spin validation and image caching. Prevents symbols from previous spins from rendering over current spin symbols.


    **Parameters**
    `image`    

    **Returns**
    void

    **Side Effects**
    - Clears rectangular region on canvas
    - Adds image to `KesiraneSlike` cache Map
    - Draws static image on canvas context

    - After transferring the money to balance removes "disabled" CSS class
    **Algorithm**
  1. Validate symbol belongs to current spin (abort if `_spinId !== currentSpinId`)
  2. Clear canvas region for symbol
  3. Check if image is cached in `KesiraneSlike` Map
  4. If cached: draw immediately
  5. If not cached: load image, cache it, then draw
  6. Validate spin ID again before drawing (prevents race conditions)
    
    **Example**
      function setButtonTakeWin(amount) {
  		...
  	dugme.onclick = () => {
    	MoneyTransfer(amount)
    	...
    }
	};



 **lines.js**

 
 **Functions**

   --nacrtajLinije2()--

  **Description**  
   Draws diagonal winning line across symbols using two canvas layers. Line segments are split between canvasLine (behind symbols) and canvasFront (in front of symbols) based on winning pattern length. Uses requestAnimationFrame loop to        continuously redraw until all symbol animations complete.

  **Parameters**
    None (reads from `dobitneLinije2[]` global array)

  **Returns** 
     void

   **Algorithm**
   1. Capture current `resizeToken` and `currentSpinId` for validation
   2. Get symbol dimensions and set line styling (yellow, thickness)
   3. Calculate line coordinates based on symbol center points
   4. Draw line segments based on match count:
      - **5 matches:** Single continuous line across all 5 symbols on canvasLine
      - **3 matches:** Split line - first part on canvasLine, extension to grid edge on canvasFront
      - **4 matches:** Similar to 3, with additional segment
   5. Use requestAnimationFrame loop to redraw while animations running
   6. Clear both canvases when all symbols finish animating


  **Side Effects**
  - Draws yellow lines on `ctxLine` canvas context (z-index: 0)
  - Draws yellow lines on `ctxFront` canvas context (z-index: 2)
  - Clears both line canvases when animations complete
  - Continuously calls requestAnimationFrame while symbols animating

  **Example**
  // Called from pokreniAnimacijuSvih() when diagonal wins detected
  if (dobitneLinije2.length > 2) {
  nacrtajLinije2(); // Draw diagonal line
  for (let simbol of dobitneLinije2) {
    startCanvasAnimation(1800, simbol);
  }
  }


  --nacrtajLinije()--

  **Description**  
   Draws horizontal winning line across symbols using two canvas layers. Line segments are split between canvasLine (behind symbols) and canvasFront (in front of symbols) based on winning pattern length. Uses requestAnimationFrame loop to continuously redraw until all symbol animations complete.

**Parameters**
- `startX` (number) - Starting X coordinate for line on canvasLine
- `endX` (number) - Ending X coordinate for canvasLine segment (also start for canvasFront)
- `endX2` (number) - Ending X coordinate for canvasFront segment 
- `y` (number) - Y coordinate for entire horizontal line 
- `grupa` (Array<Object>) - Array of winning symbols in this row for animation tracking
- `tag` (boolean) - If true, draw full 5-symbol line on canvasLine only; if false, split line across both canvases

**Returns** `void`

**Algorithm**
1. Capture `resizeToken` and `currentSpinId` for validation
2. Set line styling (yellow color, `debljina` width) on both canvas contexts
3. Start requestAnimationFrame loop:
   - Check for interruptions (`hardStop`, spin change, resize) - if detected, clear canvases and abort
   - If `tag === true`: Draw single continuous line from startX to endX on canvasLine
   - If `tag === false`: Draw split line - first segment (startX to endX) on canvasLine, second segment (endX to endX2) on canvasFront
   - Check if all symbols in `grupa` finished animating
   - If animations complete: clear line regions precisely (not entire canvas) and redraw static symbols
   - If animations ongoing: schedule next frame
4. Repeat until all animations finish or if next spin is excecuted 

**Side Effects**
- Sets `strokeStyle` and `lineWidth` on `ctxLine` and `ctxFront` contexts
- Draws yellow lines on canvasLine (z-index: 0) and canvasFront (z-index: 2)
- Clears specific line regions when animations complete (not entire canvas)
- Calls `drawStaticLogo()` for all symbols when clearing lines
- Continuously calls `requestAnimationFrame` while symbols animating

  **Example**
   // Called from pokreniAnimacijuSvih() when horizonatal wins detected
   for (let yPoz in grupe) {
   ....
   nacrtajLinije(
            grupa[0].x + 20,endX,x,Number(yPoz),grupa,tag
        );
   }
 
   // Called from animirajSledecuGrupu() when horizonatal wins detected
    if(indeks==yRedosled.length){
          ...          
          }
        else{
   	...
    nacrtajLinije(
            startX,endX,x,yPoz,grupa,tag
        );
    }


 **animations.js**

 
 **Functions**


  --startCanvasAnimation(duration, symbolObj)--

**Description**  
Initiates sprite-based animation for a winning symbol with validation, anti-overlap protection, and automatic cleanup. Loads 24-frame sprite sheet and renders animation at 30 FPS using requestAnimationFrame.

**Parameters**
- `duration` (number) - Animation duration in milliseconds (typically 1800)
- `symbolObj` (Object) - Symbol object with sprite data
  
**Returns** 
 void 

**Algorithm**
1. Validate symbol has valid src path and belongs to current spin
2. Check if symbol is already animating - abort if true
3. Check anti-overlap protection (80ms cooldown per position)
4. Cancel any existing animation loop on symbol
5. Load sprite sheet image
6. Mark symbol as running and start requestAnimationFrame loop
7. Schedule cleanup after duration expires

**Side Effects:**
- Sets `symbolObj._isRunning = true`
- Assigns `symbolObj._animationID` (requestAnimationFrame ID)
- Assigns `symbolObj._timeoutId` (setTimeout ID)
- Updates `AktivneAnimacije` Map with position key and timestamp
- Adds timeout ID to `pendingTimers` Set
- Calls `createAnimation()` to generate animation loop
- Schedules `drawStaticLogo()` call after duration

**Example:**

// Animate winning symbol for 1.8 seconds
startCanvasAnimation(1800, {
  src: 'sprites/3.png',
  x: 200,
  y: 100,
  width: 80,
  height: 80,
  _spinId currentSpinId
});
```



  --createAnimation(image, symbolData, mySpin, myResize)--

**Description**  
Creates and returns the animation loop function that renders sprite frames at 30 FPS. Handles frame timing with delta time calculation and validates spin/resize tokens on each frame to prevent stale animations.

**Parameters**
- `image` (Image) - Loaded sprite sheet (24 vertical frames)
- `symbolData` (Object) - Symbol with position data
- `mySpin` (number) - Spin ID snapshot for validation
- `myResize` (number) - Resize token snapshot for validation

**Returns** 
function - Animation loop function (called by requestAnimationFrame)

**Algorithm**
1. Initialize frame tracking variables (frameRate, frameTimer, delta time)
2. Return animation function that validates spin ID and resize token on each frame, calculates delta time between frames, clamps delta to 30ms to prevent visual jumps, clears symbol canvas region, updates frame counter when enough time passed (33.33ms), draws current sprite frame to canvas, and schedules next frame via requestAnimationFrame

**Side Effects**
- Clears rectangular canvas region at symbol position
- Draws sprite frame on canvas context
- Updates `symbolData._animationID` with new requestAnimationFrame ID
- Calls `requestAnimationFrame(animate)` recursively

**Example**
```javascript
// Internal usage by startCanvasAnimation
spriteImage.onload = () => {
  const animationFunction = createAnimation(spriteImage, symbolObj, mySpin, myResize);
  symbolObj._animationID = requestAnimationFrame(animationFunction);
};
```



   --stopAllAnimationsAndFreeze()--

 **Description**  
  Emergency stop for all running animations, timers, and loops. Cancels all requestAnimationFrame loops, clears pending timeouts, redraws all symbols as static images, and sets temporary hardStop flag to prevent new animations during cleanup.

 **Parameters** 
  None

 **Returns** 
  void

 **Algorithm**
  1. Set hardStop to true to block new animations
  2. Clear animation loop timers (timer, loopAnimacija)
  3. Cancel all pending setTimeout IDs from pendingTimers Set
  4. Iterate through all symbols in drawSymbols and mark as not running, cancel requestAnimationFrame loops
  5. Clear AktivneAnimacije Map
  6. Redraw all symbols as static images
  7. Reset hardStop to false after 100ms

  **Side Effects**
  - Sets hardStop = true (temporarily)
  - Sets animacijaLoop = false
  - Clears `timer` and loopAnimacija timeouts
  - Clears all timeouts in pendingTimers Set
  - Marks all symbols as _isRunning = false`
  - Cancels all _animationID requestAnimationFrame loops
  - Clears AktivneAnimacije Map
  - Calls drawStaticLogo() for every symbol in drawSymbols
  - Schedules hardStop = false after 100ms

**Example**
// Called on fullscreen toggle
fullBtn.addEventListener('click', () => {
  stopAllAnimationsAndFreeze();
  page.requestFullscreen();
});

// Called on window resize
window.addEventListener('resize', () => {
  stopAllAnimationsAndFreeze();
  rescaleAndreDraw();
});
```



  --pokreniAnimacijuSvih()--

  **Description**  
  Orchestrates initial "all-at-once" animation of all winning symbols across horizontal and diagonal lines simultaneously. Groups symbols by row, starts animations, draws connecting lines, and schedules sequential loop animations after 2.6 seconds.

 **Parameters** 
 None (reads from `dobitneLinije[]` and `dobitneLinije2[]`)

 **Returns**
  void

 **Algorithm**
 1. Capture current spin ID for validation
 2. Group horizontal winning symbols by Y position (row center)
 3. For each row group: calculate line coordinates based on symbol count, start animation for all symbols in row, draw connecting line via nacrtajLinije()
 4. If diagonal wins exist (dobitneLinije2.length > 2): draw diagonal line via nacrtajLinije2() and start animation for diagonal symbols
 5. Schedule pokreniAnimLoop() after 2600ms delay

 **Side Effects**
 - Calls `startCanvasAnimation(1800, simbol)` for each winning symbol
 - Calls `nacrtajLinije()` for each horizontal winning row
 - Calls `nacrtajLinije2()` if diagonal wins exist
 - Sets `startLoopTimer` timeout
 - Schedules `pokreniAnimLoop()` execution after 2.6 seconds

 **Example**
 // Called from Spoji() when wins detected
 if (dobitneLinije.length > 0 || dobitneLinije2.length > 2) {
  pokreniAnimacijuSvih(); // Start all animations simultaneously
}
```


 --pokreniAnimLoop()--

 **Description**  
 Creates looping sequence that animates winning symbols one row at a time repeatedly. Groups symbols by Y coordinate, sorts rows top-to-bottom, and recursively animates each row with 2.6 second intervals, including diagonal wins as final iteration.

 **Parameters** 
 None (reads from dobitneLinije[] and dobitneLinije2[])

 **Returns** 
 void

 **Algorithm**
 1. Set animacijaLoop to true to enable loop
 2. Group symbols by Y coordinate into grupePoY object
 3. Sort Y values top-to-bottom
 4. Define recursive function animirajSledecuGrupu() that checks if loop should continue, animates current row or diagonal based on index, increments index with wraparound (modulo), and schedules next iteration after 2600ms
 5. Start first iteration

 **Side Effects**
 - Sets animacijaLoop = true
 - Calls startCanvasAnimation(1800, simbol) for symbols in current row
 - Calls nacrtajLinije() for current row line
 - Calls nacrtajLinije2() when diagonal turn arrives
 - Sets loopAnimacija timeout for recursive calls
 - Continuously schedules itself with setTimeout until stopped

**Example**

// Called from pokreniAnimacijuSvih() after initial animations
startLoopTimer = setTimeout(() => {
  if (!hardStop && mySpin === currentSpinId) {
    pokreniAnimLoop(); // Start row-by-row loop
  }
}, 2600);
```


 **automode.js**

 
 **Functions**    


--MoneyTransferAuto(amount)--

**Description**  
Handles automatic money transfer in auto mode with optional "stop on win" functionality. Animates winnings transfer from win display to balance over 900ms, then schedules next auto spin. If "stop on win" checkbox is checked and wins exist, stops auto mode and switches to manual Take Win mode.

**Parameters**
- amount (number) - Winning amount to transfer

**Returns** 
void

**Algorithm**
1. Check if transfer already in progress (isPayingOut) - if yes, abort
2. Check "stop on win" checkbox - if checked and wins exist, stop auto mode, enable buttons, switch to manual mode and exit
3. Capture initial win and balance values
4. Animate over 900ms using requestAnimationFrame: Calculate progress percentage, interpolate values, update UI on each frame
5. On completion: update cashPlayer, call scheduleNextAutoSpin() to continue auto mode

**Side Effects:**
- Sets isPayingOut = true during transfer (prevents overlapping transfers)
- Updates winText.textContent (decreasing from amount to 0)
- Updates creditValue.textContent (increasing by amount)
- Updates cashPlayer global variable
- If "stop on win" active: calls stopAutoMode(), enables spin and gamble buttons, calls setButtonTakeWin(amount)
- If auto mode continues: calls scheduleNextAutoSpin() after transfer completes

**Example**
// Called from Spoji() when auto mode active and wins detected
if (autoMode) {
  MoneyTransferAuto(win); // Auto transfer and continue
}





--scheduleNextAutoSpin(num1, num2)--

**Description**  
Calculates appropriate delay based on winning line counts and schedules the next auto spin. Validates player balance, checks auto round limits, and stops auto mode if conditions not met (insufficient funds, max rounds reached, money limit exceeded).

**Parameters**
- num1 (number) - Number of horizontal winning symbols (dobitneLinije.length)
- num2 (number) - Number of diagonal winning symbols (dobitneLinije2.length)

**Returns** 
void

**Algorithm**
1. Validate auto mode still active - abort if not
2. Check if player has sufficient balance for next bet - stop auto mode if not
3. Check money limit if set - stop auto mode if limit reached
4. Increment currentAutoRound counter
5. Check if max rounds reached (if not infinite) - stop auto mode if limit reached
6. Calculate delay based on winning patterns: No diagonal wins and varying horizontal wins (1300-6500ms), or diagonal wins with horizontal combinations (1500-9300ms)
7. Schedule drawSlot() call after calculated delay


**Side Effects**
- Increments currentAutoRound counter
- Decrements maxMoney by bet amount if money limit set
- Sets autoTimer timeout
- Calls stopAutoMode() if insufficient funds, max rounds reached, or money limit exceeded
- Shows alert messages for stop conditions
- Schedules drawSlot() call after delay

**Example**

// Called from MoneyTransferAuto() after transfer completes
if (autoMode) {
  scheduleNextAutoSpin(dobitneLinije.length, dobitneLinije2.length);
}




--startAutoMode()--

**Description**  
Initializes and starts auto mode with configured round count and money limit. Transfers any existing winnings first, then enables auto mode UI state and triggers first auto spin.

**Parameters** 
None (reads from UI elements and global variables)

**Returns** 
void

**Algorithm**
1. Read max rounds from roundAmount array (based on i1 index)
2. Read money limit from input field
3. Set moneyTrigger flag and deduct initial bet if money limit set
4. Reset currentAutoRound counter to 0
5. Check if player has existing winnings
6. If winnings exist: transfer them first via MoneyTransfer(), then start auto mode in callback
7. If no winnings: immediately start auto mode
8. Set autoMode flag, update button states, trigger first spin

**Side Effects**
- Sets maxAutoRounds from roundAmount[i1]
- Sets maxMoney from input field value
- Sets moneyTrigger = true if money limit specified
- Decrements maxMoney by initial bet amount
- Resets currentAutoRound = 0
- Sets autoMode = true
- Adds "disabled" class to spin button
- Adds "active" class to auto button
- Adds "disabled" class to gamble button
- Calls MoneyTransfer() if existing winnings present
- Calls drawSlot() to start first spin

**Example**
// Called when user clicks auto play button
dugme2.addEventListener('click', () => {
  if (autoMode) {
    stopAutoMode();
  } else {
    startAutoMode(); // Initialize and start auto mode
  }
});




--stopAutoMode()--

**Description**  
Stops auto mode and restores manual play state. Clears all auto timers, resets counters, re-enables buttons, and restores spin button to default state.

**Parameters** None

**Returns** `void`

**Algorithm**
1. Set autoMode flag to false
2. Update button states (remove active/disabled classes)
3. Reset auto mode counters and limits to 0
4. Enable gamble button if winnings within limit
5. Clear autoTimer timeout
6. Stop animation loop
7. Call setButtonStart() to restore spin button

**Side Effects**
- Sets autoMode = false
- Removes "active" class from auto button
- Removes "disabled" class from spin button
- Resets "currentAutoRound = 0"
- Resets "maxAutoRounds = 0"
- Resets "maxMoney = 0"
- Sets "moneyTrigger = false"
- Removes `disabled` class from gamble button (if win ≤ gambleLimit)
- Clears `autoTimer` timeout
- Sets `animacijaLoop = false`
- Clears `loopAnimacija` timeout
- Calls `setButtonStart()` to restore button state

**Example**

// Called when user clicks stop button during auto mode
dugme2.addEventListener('click', () => {
  if (autoMode) {
    stopAutoMode(); // Stop auto mode
  } else {
    startAutoMode();
  }
});

// Called when insufficient funds detected
if (cashPlayer < totalBet) {
  stopAutoMode();
  alert("Nemas vise kredita!");
}


 **events .js**

 
 **Functions**

--incrementAuto()--

**Description**
Cycles through auto mode round options by incrementing the index. Updates UI to display selected round count or infinity symbol for unlimited rounds.

**Paramaters**
None

**Returns**
None

**Algorithm**
1.Increments variable that is used to traverse through the array
2.If the variable comes to the end of the array reset it to zero
3.If the variable is at the end of array(the value is 6), textContext for the HTML element that shows the num of round is "∞"
4.If the number is not the last index of the array, then the textContent of the HTML element showing the round number should be set to the array element whose index matches the variable

**Side Effects**
- Increments global `i1` variable (cycles 0-6)
- Updates `rounds` element textContent

**Example**
//HTML
<div style="color: green; font-weight: bold;" onclick="incrementAuto()" class="cursor1">+</div>


--decrementAuto()--

**Description**
Cycles through auto mode round options by decrementing the index. Updates UI to display selected round count or infinity symbol for unlimited rounds.

**Paramaters**
None

**Returns**
None

**Algorithm**
1.Decrements variable that is used to traverse through the array
2.If the variable comes to the end of the array reset it to zero
3.If the variable is at the end of array(the value is 6), textContext for the HTML element that shows the num of round is "∞"
4.If the number is not the last index of the array, then the textContent of the HTML element showing the round number should be set to the array element whose index matches the variable

**Side Effects**
- Decrements global `i1` variable (cycles 0-6)
- Updates `rounds` element textContent

**Example**
//HTML
<div style="color: red; font-weight: bold; "onclick="decrementAuto()" class="cursor1">-</div>

--increment()--

**Description**
Cycles through bet amount options by incrementing the index. Updates UI to display selected amount 

**Paramaters**
None

**Returns**
None

**Algorithm**
1.Increments variable that is used to traverse through the array
2.If the variable comes to the end of the array reset it to zero

**Side Effects**
- Increments global `i` variable (cycles 0-4)
- Updates `bet` element textContent
-Updates `TotalBet`element textContent by multyplying bet amount with number five
**Example**
//HTML
<div style="color: green; font-weight: bold;" onclick="increment()" class="cursor">+</div>

--decrement()--

**Description**
Cycles through bet amount options by decrementing the index. Updates UI to display selected amount .

**Paramaters**
None

**Returns**
None

**Algorithm**
1.Decrements variable that is used to traverse through the array
2.If the variable comes to the end of the array reset it to zero

**Side Effects**
- Decrements global `i` variable (cycles 0-4)
- Updates `bet` element textContent
- Updates `TotalBet`element textContent by multyplying bet amount with number five

**Example**
//HTML
  <div style="color: red; font-weight: bold; "onclick="decrement()" class="cursor">-</div>



 **resize.js**


 **Functions**

  --resize()--

**Description**  
Calculates and applies responsive scaling for all game elements (canvases, UI panel, buttons) based on container size. Maintains aspect ratio using letterbox technique and handles high-DPI displays with devicePixelRatio scaling.

**Parameters** 
   None

**Returns** 
void

**Algorithm**
1. Get container dimensions and device pixel ratio
2. Calculate scale factor to fit 1366×768 design into container while maintaining aspect ratio
3. Calculate letterbox offsets to center scaled content
4. Position and size all three canvases (canvas1, canvas2, canvas3) based on REELS coordinates
5. Set internal canvas resolution accounting for DPI (width/height attributes)
6. Apply DPI transform to all canvas contexts
7. Position and size info panel based on PANEL coordinates
8. Scale all UI elements (buttons, labels, text) proportionally using calculated scale factors

**Side Effects**
- Updates CSS positioning (left, top) for all three canvases
- Updates CSS dimensions (width, height) for all three canvases
- Sets internal canvas resolution (width, height attributes) with DPI scaling
- Applies transform matrix to all three canvas contexts (ctx, ctxLine, ctxFront)
- Updates info panel CSS positioning and dimensions
- Updates fontSize and dimensions for all UI elements (.info-labels, .buttonGamble, .infoBet, .forBet, .textInfo, .info-wrapper)

**Example**


--rescaleAndreDraw()--

**Description**  
Recalculates symbol positions from normalized coordinates and redraws them as static images after resize. Stops all animations, clears canvas, converts normalized coordinates back to absolute pixels, and stops auto mode if active.

**Parameters**
 None (reads from global drawSymbols[])

**Returns** 
void

**Algorithm**
1. Validate drawSymbols array exists and is not empty
2. Schedule stopAllAnimationsAndFreeze() after 1 second delay
3. Get current canvas dimensions
4. Clear entire canvas
5. For each symbol in drawSymbols validate spin ID matches current spin, convert normalized coordinates (nx, ny, nw, nh) to absolute pixel coordinates (x, y, width, height), redraw symbol as static image
6. Stop auto mode and remove active styling from auto button

**Side Effects**
- Calls stopAllAnimationsAndFreeze() after 1000ms delay
- Clears entire canvas via ctx.clearRect(0, 0, cssW, cssH)
- Updates all symbol coordinates (x, y, width, height) from normalized values
- Calls drawStaticLogo(s) for each valid symbol
- Removes "active" class from auto button (dugme2)
- Calls stopAutoMode() to halt auto mode

**Example**
// Called after resize() completes
function handleResizeChange() {
  resizeToken++;
  resize();
  rescaleAndreDraw(); // Redraw symbols with new coordinates
}




--handleResizeChange()--

**Description**  
Main resize handler that invalidates ongoing operations, recalculates layout, and redraws symbols. Increments resize token to abort stale animations, calls resize to update layout, and calls rescaleAndreDraw to update symbol positions.

**Parameters** 
None

**Returns** 
void

**Algorithm**
1. Increment resizeToken to invalidate all ongoing animations and line drawings
2. Call resize() to recalculate canvas and UI element dimensions
3. Call rescaleAndreDraw() to convert symbol coordinates and redraw

**Side Effects**
- Increments global resizeToken variable
- Triggers all side effects of resize() function
- Triggers all side effects of rescaleAndreDraw() function


# Very Hot 5 - Configuration & Development Guide

---

 Configuration Guide

Game Parameters

// game.js
const betAmount = [1, 2, 5, 10, 20];        // Dostupni bet-ovi
const roundAmount = [10, 25, 50, 100, 250, 500, Infinity];  // Auto-play runde
const gambleLimit = 100;                     // Max win za gamble


Animation Settings

// animations.js
const frameInterval = 1000/30;               // 30 FPS
const animationDuration = 1800;              // Trajanje animacije simbola (ms)
const loopDelay = 2600;                      // Delay između loop animacija (ms)
const antiOverlapDelay = 80;                 // Anti-overlap na istom polju (ms)


Visual Configuration

// resize.js
const DESIGN_W = 1366;                       // Design širina
const DESIGN_H = 768;                        // Design visina
const REELS = {                              // Pozicija slot area
    left: 168, 
    top: 68, 
    width: 1035, 
    height: 565
};

// lines.js
ctxLine.strokeStyle = "yellow";              // Boja linija
ctxLine.lineWidth = debljina;                // Debljina linija
```

---

Development Guide

 Key Systems

Spin ID System - Sprečava animacije iz starih spinova:

currentSpinId++;                             // Svaki spin dobija unique ID
symbolObj._spinId = currentSpinId;           // Povezivanje
if (mySpin !== currentSpinId) return;        // Validacija


Resize Token - Invalidira animacije pri resize-u:

resizeToken++;                               // Pri resize-u
if (myResize !== resizeToken) return;        // Provjera


Normalized Coordinates - Za responsive design:

s.nx = s.x / cssW;                           // Čuvanje relativne pozicije
s.x = s.nx * cssW;                           // Vraćanje u apsolutnu


Common Tasks

Dodavanje novog bet-a

const betAmount = [1, 2, 5, 10, 20, 50];    // Dodaj vrednost


Dodavanje novog broja rundi za autoMode

const roundAmount = [5,10,25,50,100,1000,Infinity]; // Dodaj novi broj rundi

Promena boje linija:

ctxLine.strokeStyle = "red";                 // U lines.js


Promena brzine animacije

startCanvasAnimation(2400, simbol);          // Umesto 1800ms


Important Variables


// Globalne kontrole
currentSpinId       // ID trenutnog spina
resizeToken        // Token za resize validaciju
hardStop           // Emergency stop flag
autoMode           // Auto-play status
animacijaLoop      // Loop animacija status

// Per-symbol tracking
_spinId            // Povezan spin ID
_isRunning         // Da li je animacija aktivna
_animationID       // requestAnimationFrame ID
_timeoutId         // setTimeout ID




