Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response(Bun.file('./index.html'));
  },
});
console.log('Server running on http://localhost:3000');
