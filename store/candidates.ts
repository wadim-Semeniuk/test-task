import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  skills: string[];
  resume_file: File | string;
  github_url: string;
}

export const useCandidateStore = defineStore('candidate', {
  state: () => ({
    candidates: ref<Candidate[]>([
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
    ]),
  }),
  actions: {
    addCandidate(candidate: Candidate) {
      this.candidates.push(candidate);
    },
    updateCandidate(updatedCandidate: Candidate) {
      const index = this.candidates.findIndex(c => c.id === updatedCandidate.id);

      if (index !== -1) {
        this.candidates[index] = { ...this.candidates[index], ...updatedCandidate };
      } else {
        throw new Error(`Candidate with id ${updatedCandidate.id} not found`);
      }
    },

    getCandidate(id: number): Candidate | undefined {
      return this.candidates.find(candidate => candidate.id === id);
    }
  }
})
