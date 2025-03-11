<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :required="required"
      :placeholder="placeholder"
    >
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    id: String,
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    value: String,
    required: {
      type: Boolean,
      default: false
    },
    placeholder: String
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52,152,219,0.1);
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .form-group label {
    color: #e2e8f0;
  }

  .form-group input {
    background: #1a202c;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .form-group input:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66,153,225,0.1);
  }
}
</style>
