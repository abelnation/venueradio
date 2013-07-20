import json, requests

API_URL = 'http://api.seatgeek.com/2/'

def get_spotify_id(performer_id):
    resp = requests.get(API_URL + 'performers/{0}'.format(performer_id))
    if resp.status_code == 200:
        resp = json.loads(resp.content)
    else:
        return None
    spotify_links = [x for x in resp['links'] if x['provider'] == 'spotify']
    if spotify_links:
        spotify_id = spotify_links[0]['id']
    else:
        return None
    return spotify_id

def get_venue_performers(venue_id):
    """
        gets performers from the next 20 concerts at the venue
    """
    # taxonomy 2000000 is music
    params = {
        'venue.id' : venue_id,
        'taxonomies.id' : 2000000,
        'per_page' : 5
    }
    resp = requests.get(API_URL + 'events', params = params)
    if resp.status_code == 200:
        resp = json.loads(resp.content)
    else:
        print 'api response returned {0}'.format(resp.status_code)
        sys.exit(0)
    events = resp['events']
    performers = map(lambda event: [p['id'] for p in event['performers']], events)
    performers = reduce(lambda x, y: x + y, performers)

    return list(set(performers))

def main():
    import os, sys, argparse

    parser = argparse.ArgumentParser(description='Script to get spotify tracks')
    parser.add_argument('--venue_id', default=None)
    parser.add_argument('--html_file', default=None)
    args = parser.parse_args()
    venue_id = args.venue_id
    html_file = args.html_file

    if venue_id is None:
        print 'need venue id'
        sys.exit(0)

    if html_file is None:
        print 'need html file to write to'

    performers = get_venue_performers(venue_id)
    with open(html_file, 'w') as f:
        for performer in performers:
            spotify_id = get_spotify_id(performer)
            if spotify_id is not None:
                f.write('<iframe src="https://embed.spotify.com/?uri={0}" width="300" height="100"></iframe><br/>'.format(spotify_id))

    print 'file available at ' + html_file

if __name__ == '__main__':
    main()
