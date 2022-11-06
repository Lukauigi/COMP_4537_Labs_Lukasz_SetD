class PokemonBadRequest extends Error {
    constructor(message) {
        super(message);
        this.name = 'PokemonBadRequest';
        this.message = "Error: Bad request."
        this.pokeErrorCode = 400;
    }
}

class PokemonBadRequestMissingID extends PokemonBadRequest {
    constructor(message) {
        super(message);
        this.name = 'PokemonBadRequestMissingID';
        this.message = 'Error: Bad request, no ID.'
        this.pokeErrorCode = 400;
    }
}

class PokemonDbError extends Error {
    constructor(message) {
        super(message);
            this.name = 'PokemonDbError';
            this.message = 'DB Error: Could not use API endpoint.'
            this.pokeErrorCode = 500;
    }
}

class PokemonNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PokemonNotFoundError';
        this.message = 'PokemonNotFoundError: Pokemon was not found, check your request';
        this.pokeErrorCode = 400;
    }
}

class PokemonNoRouteError extends PokemonBadRequest {
    constructor(message) {
        super(message);
        this.name = 'PokemonNoRouteError';
        this.message = 'PokemonNoRouteError: Improper route.'
        this.pokeErrorCode = '404'
    }
}

module.exports = {
    PokemonBadRequest,
    PokemonBadRequestMissingID,
    PokemonDbError,
    PokemonNotFoundError,
    PokemonNoRouteError
}