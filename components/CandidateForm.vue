<template>
  <q-layout>
    <q-page-container>
      <q-page
        padding
        class="q-pa-md flex flex-center"
      >
        <div
          class="q-pa-md"
          style="max-width: 800px; width: 100%;"
        >
          <h3>
            {{ title }}
          </h3>
          <q-form @submit.prevent="onSubmit">
            <q-input
              filled
              v-model="formData.first_name"
              label="First Name"
              :error="!!errors.first_name"
              :error-message="errors.first_name"
            />
            <q-input
              filled
              v-model="formData.last_name"
              label="Last Name"
              :error="!!errors.last_name"
              :error-message="errors.last_name"
            />
            <q-input
              filled
              v-model="formData.email"
              type="email"
              label="Email"
              :error="!!errors.email"
              :error-message="errors.email"
            />
            <q-input
              filled
              v-model="formData.bio"
              type="textarea"
              label="Bio"
            />
            <q-field
              label="Skills"
              class="q-mb-md"
            >
              <template v-slot:after>
                <q-banner
                  v-if="errors.skills"
                  class="text-red-10"
                >
                  {{ errors.skills }}
                </q-banner>
              </template>
              <q-item
                v-for="(skill, index) in formData.skills"
                :key="index"
                class="q-mb-sm"
              >
                <q-input
                  v-model="formData.skills[index]"
                  label="Skill"
                  filled
                  class="q-mb-sm"
                />
                <q-btn
                  flat
                  dense
                  icon="delete"
                  @click="removeSkill(index)"
                  class="q-ml-sm"
                />
              </q-item>
              <q-btn
                flat
                icon="add"
                class="q-mt-md"
                @click="addSkill"
              >
                Add Skill
              </q-btn>
            </q-field>
            <q-file
              filled
              v-model="formData.resume_file as File"
              label="Resume"
              :error="!!errors.resume_file"
              :error-message="errors.resume_file"
              @change="handleFileUpload"
            />
            <q-input
              filled
              v-model="formData.github_url"
              type="url"
              label="Github URL"
              :error="!!errors.github_url"
              :error-message="errors.github_url"
            />
            <div class="q-gutter-md q-mb-md">
              <q-btn
                label="Back"
                color="secondary"
                @click="goBack"
              />
              <q-btn
                type="submit"
                label="Save"
                color="primary"
              />
            </div>
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useForm, useField } from 'vee-validate';
import { string, array, object, mixed } from 'yup';
import { useRouter } from 'vue-router';
import type { Candidate } from '@/store/candidates';

const props = defineProps<{
  candidate?: Candidate;
  title: string;
}>();

const emit = defineEmits<{
  (e: 'submit', candidate: Candidate): void;
}>();

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const isValidFileSize = (size: number) => size <= MAX_FILE_SIZE;

const router = useRouter();

const candidateSchema = object({ // used yup for easier work with vee-validate
  first_name: string().required('First name is required'),
  last_name: string().required('Last name is required'),
  email: string().required('Email is required').email('Please enter a valid email address'),
  bio: string().notRequired(),
  skills: array().min(1, 'At least one skill is required'),
  resume_file: mixed<File>()
  .required('Resume is required')
  .test('fileSize', 'File size must be less than 2MB', (value) => (
    value ? isValidFileSize(value.size) : true
  )),
  github_url: string().url('Please enter a valid URL').notRequired(),
});

const { handleSubmit, errors, setFieldError, resetForm } = useForm({
  validationSchema: candidateSchema,
  initialValues: {
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    skills: [] as string[],
    resume_file: '',
    github_url: ''
  }
});

const formData = reactive({
  first_name: useField<string>('first_name').value,
  last_name: useField<string>('last_name').value,
  email: useField<string>('email').value,
  bio: useField<string>('bio').value,
  skills: useField<string[]>('skills').value,
  resume_file: useField<File | null>('resume_file').value,
  github_url: useField<string>('github_url').value,
});

watch(() => props.candidate, (existedCandidate) => {
  if (existedCandidate) {
    const { first_name, last_name, email, bio, skills, github_url } = existedCandidate;

    resetForm({
      values: {
        first_name,
        last_name,
        email,
        bio,
        skills,
        github_url,
        resume_file: '', // reset the resume_file field as it cannot be pre-filled with file input
      }
    });
  }
},
{
  immediate: true,
}
);

const handleFileUpload = (event: Event) => {
  formData.resume_file = (event.target as HTMLInputElement).files?.[0] || null;
};

const goBack = () => router.push('/candidates');

const addSkill = () => formData.skills.push('');

const removeSkill = (index: number) => formData.skills.splice(index, 1);

const onSubmit = handleSubmit((values) => {
  if (!values.resume_file) {
    setFieldError('resume_file', 'Resume is required');

    return;
  }

  emit('submit', {
    ...values,
    id: props.candidate?.id || Date.now(),
  });
});
</script>
