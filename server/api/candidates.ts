import { defineEventHandler, readBody, createError } from 'h3';

const candidates = [
  {
    id: 1,
    first_name: 'Wasia',
    last_name: 'Rock',
    email: 'test1@test.com',
    bio: 'Frontend developer',
    skills: ['Javascript', 'CSS'],
    resume_file: '',
    github_url: 'https://github.com/wasia',
  },
  {
    id: 2,
    first_name: 'Peter',
    last_name: 'Parker',
    email: 'test2@test.com',
    bio: 'Backend Developer',
    skills: ['Javascript', 'Node.js'],
    resume_file: '',
    github_url: 'https://github.com/peter',
  },
  {
    id: 3,
    first_name: 'Sonia',
    last_name: 'Shine',
    email: 'test3@test.com',
    bio: 'CEO',
    skills: ['Slack'],
    resume_file: '',
    github_url: 'https://github.com/sonia',
  },
];

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const url = event.node.req.url || '';

  if (method === 'GET' && url === '/api/candidates') {
    return candidates;
  }

  if (method === 'GET' && url.startsWith('/api/candidates/')) {
    const id = parseInt(url.split('/').pop() || '', 10);

    if (isNaN(id)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid candidate ID' });
    }

    const candidate = candidates.find((c) => c.id === id);

    if (!candidate) {
      throw createError({ statusCode: 404, statusMessage: 'Candidate not found' });
    }

    return candidate;
  }

  if (method === 'POST' && url === '/api/candidates') {
    const newCandidate = await readBody(event);

    if (!newCandidate) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid candidate data' });
    }

    newCandidate.id = Date.now(); // Generate unique ID using current time - in real cases, you should use uuid(as example)
    candidates.push(newCandidate);

    return newCandidate;
  }

  if (method === 'PUT' && url.startsWith('/api/candidates/')) {
    const id = parseInt(url.split('/').pop() || '', 10);

    if (isNaN(id)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid candidate ID' });
    }

    const updatedCandidate = await readBody(event);

    if (!updatedCandidate) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid candidate data' });
    }

    const index = candidates.findIndex((c) => c.id === id);

    if (index === -1) {
      throw createError({ statusCode: 404, statusMessage: 'Candidate not found' });
    }

    candidates[index] = { ...candidates[index], ...updatedCandidate };

    return candidates[index];
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
