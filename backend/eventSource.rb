# app.rb
require 'faye/websocket'
require 'json'

clients = []
App = lambda do |env|
  if Faye::EventSource.eventsource?(env)
    es = Faye::EventSource.new(env,:headers => {'Access-Control-Allow-Origin' => '*'})
    clients.push(es)

    es.on :close do |event|
      clients.delete(es)
      es = nil
    end
    es.rack_response
  else
    req = Rack::Request.new(env)
    if req.post?
      body = req.body.read
      clients.each do |c|
        c.send(body);
      end
      [200, {'Content-Type' => 'text/plain'}, ['Message Delivered']]
    else
      [405, {'Content-Type' => 'text/plain'}, ['Method Not Allowed']]
    end
  end
end