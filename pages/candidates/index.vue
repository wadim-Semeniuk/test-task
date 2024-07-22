<template>
  <q-layout>
    <q-page-container>
      <q-page padding class="q-pa-md flex flex-center">
        <div
          class="q-pa-md"
          style="max-width: 800px; width: 100%;"
        >
          <header class="q-mb-md">
            <h2>Home</h2>
            <div class="q-gutter-md row items-center q-mb-md">
              <q-input
                v-model="searchQuery"
                placeholder="Search candidates"
                filled
                class="col"
              />
              <q-btn
                color="green"
                @click="goToAddCandidate"
              >
                Add Candidate
              </q-btn>
            </div>
          </header>
          <q-table
            :rows="filteredCandidates"
            :columns="columns"
            hide-pagination
            row-key="id"
            class="q-mb-md"
            no-data-label="No results found"
            no-results-label="No results found"
          >
            <template v-slot:body-cell-full_name="props">
              <q-td :props="props">
                {{ props.row.first_name }} {{ props.row.last_name }}
              </q-td>
            </template>
            <template v-slot:body-cell-email="props">
              <q-td :props="props">
                {{ props.row.email }}
              </q-td>
            </template>
            <template v-slot:body-cell-skills="props">
              <q-td :props="props">
                {{ props.row.skills.join(', ') }}
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  color="primary"
                  @click="goToEditCandidate(props.row.id)"
                >
                  Edit
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import { type Candidate, useCandidateStore } from '@/store/candidates';

const searchQuery = ref('');
const store = useCandidateStore();
const router = useRouter();

const columns: QTableColumn[] = [
  {
    label: 'Full Name',
    name: 'full_name',
    required: true,
    align: 'left',
    field: (row: Candidate) => `${row.first_name} ${row.last_name}`,
    format: (val: string) => `${val}`,
    sortable: false,
  },
  {
    name: 'email',
    align: 'left',
    label: 'Email',
    field: 'email',
    sortable: false,
  },
  {
    name: 'skills',
    align: 'left',
    label: 'Skills',
    field: (row: Candidate) => row.skills.join(', '),
    format: (val: string) => val,
    sortable: false,
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Actions',
    field: 'actions',
    sortable: false,
  }
];

const filteredCandidates = computed(() => { // in real cases, you should use debounce and more advanced search here
  const query = searchQuery.value.toLowerCase();

  return store.candidates.filter((candidate: Candidate) => {
    return (
      candidate.first_name.toLowerCase().includes(query) ||
      candidate.last_name.toLowerCase().includes(query) ||
      candidate.email.toLowerCase().includes(query) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(query))
    );
  });
});

const goToAddCandidate = () => router.push('/candidates/add');

const goToEditCandidate = (id: number) => router.push(`/candidates/edit/${id}`);
</script>
