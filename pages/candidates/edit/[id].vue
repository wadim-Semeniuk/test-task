<template>
  <CandidateForm
    :candidate="candidate"
    title="Edit Candidate"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCandidateStore } from '@/store/candidates';
import CandidateForm from '@/components/CandidateForm.vue';
import type { Candidate } from '@/store/candidates';

const route = useRoute();
const router = useRouter();
const store = useCandidateStore();
const candidate = ref<Candidate>();

onMounted(() => candidate.value = store.getCandidate(Number(route.params.id as string)));

const handleSubmit = (updatedCandidate: Candidate) => {
  store.updateCandidate(updatedCandidate);
  router.push('/candidates');
};
</script>
