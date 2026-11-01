function fn() {
  // Pass -DbaseUrl=http://localhost:3001 to point the tests at a different port
  var baseUrl = karate.properties['baseUrl'] || 'http://localhost:3001';
  return { baseUrl: baseUrl };
}