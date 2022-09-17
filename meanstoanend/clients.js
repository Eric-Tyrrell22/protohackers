// https://stackoverflow.com/questions/22697936/binary-search-in-javascript
// https://creativecommons.org/licenses/by-sa/4.0/
/**
 * Return 0 <= i <= array.length such that !pred(array[i - 1]) && pred(array[i]).
 */
function binarySearch(array, pred) {
	let lo = -1, hi = array.length;
	while (1 + lo < hi) {
			const mi = lo + ((hi - lo) >> 1);
			if (pred(array[mi])) {
					hi = mi;
			} else {
					lo = mi;
			}
	}
	return hi;
}

/**
 * Return i such that array[i - 1] < item <= array[i].
 */
function lowerBound(array, item) {
  return binarySearch(array, j => item <= j);
}

/**
 * Return i such that array[i - 1] <= item < array[i].
 */
function upperBound(array, item) {
	return binarySearch(array, j => item < j);
}

class Client {
  constructor( id ) {
    this.id = id;
    this.timestamps = [];
    this.timeseries = {};
  }

  insert({ timestamp, val }) {
    const lower = lowerBound( this.timestamps, timestamp );
    this.timestamps.splice(lower, 0, timestamp );
    //kthis.timestamps.push( timestamp );
    // super lazy. should either insert correctly, or use btrees
    /*
    this.timestamps = this.timestamps.sort(function(a, b) {
      return a - b;
    });
    */
    this.timeseries[ timestamp ] = val;
  }

  query({ min_time, max_time }) {
    if ( min_time > max_time ) {
      return 0;
    }
    const lower = lowerBound( this.timestamps, min_time );
    const upper = upperBound( this.timestamps, max_time );
    let timestamps = this.timestamps.slice( lower, upper );
    if( lower === upper ) {
      if( this.timestamps[ lower ] > this.min_time 
        && this.timestamps[ upper ] < this.max_time ) {
        timestamps = [ this.timestamps[ lower ] ];
      } else {
        return 0 
      }
    }
    const vals = timestamps.map( ts => {
      return this.timeseries[ ts ]
    });
    if( vals.length === 0 ) {
      return 0;
    }
    const sum = vals.reduce(( a, b ) => a + b, 0);
    console.log({
      sum,
      min_time,
      max_time,
      lower,
      upper,
      timestamps
    });
    console.log( `finsihed querying ${min_time}: ${ max_time} for ${this.id }` )
    return Math.floor( sum / vals.length );
  }
}

class Clients {
  constructor() {
    this.clients = {};
  }

  insert({ client_id, timestamp, val }) {
    this.clients[ client_id ] ||= new Client( client_id );
    const client = this.clients[ client_id ];
    client.insert({ timestamp, val });
  }

  query({ client_id, min_time, max_time }) {
    console.log( { min_time, max_time });
    const client = this.clients[ client_id ];
    if( client ) {
      return client.query({ min_time, max_time });
    } else {
      return
    }
  }
}

module.exports = new Clients();
