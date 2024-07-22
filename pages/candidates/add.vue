<template>
  <CandidateForm
    title="Add Candidate"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCandidateStore } from '@/store/candidates';
import CandidateForm from '@/components/CandidateForm.vue';
import type { Candidate } from '@/store/candidates';

const router = useRouter();
const store = useCandidateStore();

const handleSubmit = (candidate: Candidate) => {
  store.addCandidate(candidate);
  router.push('/candidates');
};
</script>
