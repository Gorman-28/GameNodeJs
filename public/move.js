function onKeydown(e){
	if(e.which === 27){
        socket.emit('end');
    }
	
	if(e.key === 'd' && movingRight === false ){
		movingRight = true;
		console.log('start');
		if(movingLeft === true ){return;}
		else if( movingDown === true ){return;}
		else if( movingUp === true ){return;}
		else{
			if(team==='blue'){
			moveRight();
			}
			if(team==='red'){
			moveRight1();
			}
			}
	}
	if(e.key === 'a' && movingLeft === false ){
		
		movingLeft = true;
		if( movingRight === true ){return;}
		else if( movingDown === true ){return;}
		else if( movingUp === true ){return;}
		else{
			if(team==='blue'){
			moveLeft();
			}
			if(team==='red'){
			moveLeft1();
			}
			}
	}
	if(e.key === 's' && movingDown === false ){
		
		movingDown = true;
		if( movingLeft === true ){return;}
		else if( movingRight === true ){return;}
		else if( movingUp === true ){return;}
		else{moveDown();}
	}
	if(e.key === 'w' && movingUp === false ){
		
		movingUp = true;
		if( movingLeft === true ){return;}
		else if( movingDown === true ){return;}
		else if( movingRight === true ){return;}
		else{moveUp();}
	}
}
function onKeyup(e){
	if(e.key === 'd' && movingRight === true ){
		movingRight = false;
		
		cancelAnimationFrame( movingID );
		
		if( movingLeft === true ){
			if(team==='blue'){
			moveLeft();
			}
			if(team==='red'){
			moveLeft1();
			}}
		else if( movingDown === true ){moveDown();}
		else if( movingUp === true ){moveUp();}
	}
	if(e.key === 'a' && movingLeft === true ){

		movingLeft = false;
		cancelAnimationFrame( movingID );
		if( movingRight === true ){
			if(team==='blue'){
			moveRight();
			}
			if(team==='red'){
			moveRight1();
			}}
		else if( movingDown === true ){moveDown();}
		else if( movingUp === true ){moveUp();}
		
	}
	if(e.key === 's' && movingDown === true ){
	
		movingDown = false;
		cancelAnimationFrame( movingID );
		if( movingRight === true ){
			if(team==='blue'){
			moveRight();
			}
			if(team==='red'){
			moveRight1();
			}}
		else if( movingLeft === true ){
			if(team==='blue'){
			moveLeft();
			}
			if(team==='red'){
			moveLeft1();
			}}
		else if( movingUp === true ){moveUp();}
		
	}if(e.key === 'w' && movingUp === true ){
	
		movingUp = false;
		cancelAnimationFrame( movingID );
		if( movingLeft === true ){
			if(team==='blue'){
			moveLeft();
			}
			if(team==='red'){
			moveLeft1();
			}}
		else if( movingDown === true ){moveDown();}
		else if( movingRight === true ){
			if(team==='blue'){
			moveRight();
			}
			if(team==='red'){
			moveRight1();
			}}
		
	}
}

function moveRight(){
	
	if(player_x +(6*coef_w) >= x_rec  ){
		
		movingRight = false;
		onKeyup();
	}
	
	movingID = requestAnimationFrame( moveRight );
	player_x+= step;
	playerElem.style.left = player_x + 'px';
	socket.emit('player_move',player_x,player_y,my_num,team);
}

function moveLeft(){
	if(player_x  <= 0  ){
		
		movingLeft = false;
		onKeyup();
	}
	
	
	movingID = requestAnimationFrame( moveLeft );
	player_x-= step;
	playerElem.style.left = player_x + 'px';
	socket.emit('player_move',player_x,player_y,my_num,team);
}

function moveUp(){
	if(player_y  <= 0  ){
		
		movingUp = false;
		onKeyup();
	}
	movingID = requestAnimationFrame( moveUp );
	player_y-= step;
	playerElem.style.top = player_y + 'px';
	socket.emit('player_move',player_x,player_y,my_num,team);
}
function moveDown(){
	if(player_y+ (8 * coef_h)  >= window.screen.height  ){
		
		movingDown = false;
		onKeyup();
	}
	movingID = requestAnimationFrame( moveDown );
	player_y+= step;
	playerElem.style.top = player_y + 'px';
	socket.emit('player_move',player_x,player_y,my_num,team);
}