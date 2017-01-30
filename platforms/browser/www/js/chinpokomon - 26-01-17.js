var menuinicio = {
  start: function() {  
    this.iniciaBotones();
  },

  iniciaFastClick: function () {
    FastClick.attach(document.body);
  },

  iniciaBotones: function() {
    var buttonAction = document.querySelector('#boton-start');
    buttonAction.addEventListener('click', function(){
      var captura = document.getElementById("bienvenida");
	  captura.classList.add("oculto");
	  console.log("lol");
	  // Lanzamos el juego
	  app.inicio();
  });
  },

}; // Ojo con esto

var app = {
	inicio: function() {
		

		DIAMETRO_BOLA = 50;

		velocidadX = 0;
		velocidadY = 0;
		
		puntuacion = 0;
		dificultad = 0;

		alto = document.documentElement.clientHeight;
		ancho = document.documentElement.clientWidth;

		app.vigilaSensores();
		app.iniciaJuego();

	},

	iniciaJuego: function() {

		var estados = { preload: preload, create: create, update: update };
		var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
		var chinpokomonacazar = 'chinpokomon01';

		// Tenemos dos estados de juego
		// Preparamos cosas
		function preload() {
			game.stage.backgroundColor = '#f27d0c';
			game.physics.startSystem(Phaser.Physics.ARCADE);

			game.load.atlasJSONHash('pokebola', 'assets/pokebol_sprite.png', 'assets/pokebol_sprite.json');
			game.load.atlasJSONHash('chinpokomon01', 'assets/chinpo_escarabajobot_sprite.png', 'assets/chinpo_sprite.json');
			game.load.atlasJSONHash('chinpokomon02', 'assets/chinpo_pinguino_sprite.png', 'assets/chinpo_sprite.json');
			game.load.atlasJSONHash('chinpokomon03', 'assets/chinpo_zapato_sprite.png', 'assets/chinpo_sprite.json');
			game.load.atlasJSONHash('chinpokomon04', 'assets/chinpo_pinguino_sprite.png', 'assets/chinpo_sprite.json');
			game.load.atlasJSONHash('chinpokomon05', 'assets/chinpo_zapato_sprite.png', 'assets/chinpo_sprite.json');
		}

		// Ponemos las cosas en el juego
		function create() {
			
			game.stage.backgroundColor = "#38C653";							
		    
			objetivo = game.add.sprite(app.inicioX(), app.inicioY(), chinpokomonacazar);
			objetivo.animations.add('run'); // Para arrancar el movimiento del sprite
    		objetivo.animations.play('run', 10, true); 

			bola = game.add.sprite(app.inicioX(), app.inicioY(), 'pokebola');
			bola.animations.add('run'); 
    		bola.animations.play('run', 10, true); 

			game.physics.arcade.enable(bola);
			game.physics.arcade.enable(objetivo);

			bola.body.collideWorldBounds = true;
			bola.body.onWorldBounds = new Phaser.Signal();
			bola.body.onWorldBounds.add(app.decrementaPuntuacion, this)

			// Bajamos esto para que no se pinte nada encima	
			scoreText = game.add.text(16, 16, puntuacion, { fontsize: '100px', fill: '#757676' });
		}

		function update() {
			var factorDificultad = (300 + (dificultad * 100));
			bola.body.velocity.y = (velocidadY * factorDificultad);
			bola.body.velocity.x = (velocidadX * ( -1 * factorDificultad));

			// game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
			game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
		}

		function cambiarPokemon() {
		// Aquí deberemos cambiar el sprite
		    var random = 0;
		    random = Math.floor((Math.random() * 5) + 1);
			switch(random) {
		        case 1:
		            chinpokomonacazar = 'chinpokomon02';     
		            break;
		        case 2:
		            chinpokomonacazar = 'chinpokomon02';
		            break;
		        case 3:
		            chinpokomonacazar = 'chinpokomon02';
		            break;
		        case 4:
		            chinpokomonacazar = 'chinpokomon02';
		            break;
		        case 5:
		            chinpokomonacazar = 'chinpokomon02';
		            break;                                    
		        default:
		            chinpokomonacazar = 'chinpokomon02';
		    } 
		}

		// Aqui iban la definicion de estados y game...
	},

	decrementaPuntuacion: function() {
		puntuacion = puntuacion-1;
		scoreText.text = puntuacion;
	},

	incrementaPuntuacion: function() {
		puntuacion = puntuacion+10;
		scoreText.text = puntuacion;
    
		objetivo.body.x = app.inicioX();
		objetivo.body.y = app.inicioY();

		if (puntuacion > 0) {
			dificultad = dificultad + 1;
		}
	},

	inicioX: function() {
		return app.numeroAleatorioHasta( ancho - DIAMETRO_BOLA);
	},

	inicioY: function() {
		return app.numeroAleatorioHasta( alto - DIAMETRO_BOLA);
	},

	numeroAleatorioHasta: function(limite) {
		return Math.floor(Math.random() * limite);
	},

	vigilaSensores: function() {
		
		function onError() {
			console.log('onError');
		}

		function onSuccess(datosAceleracion) {
			app.detectaAgitacion(datosAceleracion);
			app.registraDireccion(datosAceleracion);
		}

		navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 10 });
	},

	detectaAgitacion: function(datosAceleracion) {
		agitacionX = datosAceleracion.x > 10;
		agitacionY = datosAceleracion.y > 10;

		if (agitacionX || agitacionY) {
			setTimeout(app.recomienza, 1000);
		}	
	},

	recomienza: function() {
		document.location.reload(true);		
	},

	registraDireccion: function(datosAceleracion) {
		velocidadX = datosAceleracion.x;
		velocidadY = datosAceleracion.y;
	}

};

if ('addEventListener' in document) {
	document.addEventListener('deviceready', function() {
		menuinicio.start();		
	}, false);
}


