<!-- eslint-disable vue/require-v-for-key vue/no-unused-vars -->
<template>
  <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="320"
      offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        v-bind="attrs"
        v-on="on"
        size="16"
        color="secondary"
      >
        {{active ? 'mdi-filter' : 'mdi-filter-outline'}}
      </v-icon>
    </template>
    <v-card class="pa-4" color="filter-wrapper">
      <template v-if="type === 'range'">
        <v-sheet class="pa-3">
        <v-range-slider
            v-model="model"
            :max="max"
            :min="min"
            hide-details
            step="0.01"
            class="align-center d-block"
        >
          <template v-slot:append>
            <v-row>
              <v-col>
                <v-text-field
                  type="number"
                  label="Min"
                  :value="model[0]"
                  @change="$set(model, 0, $event)"
                />
              </v-col>
              <v-col>
                <v-text-field
                  type="number"
                  label="Max"
                  :value="model[1]"
                  @change="$set(model, 1, $event)"
                />
              </v-col>
            </v-row>
          </template>
        </v-range-slider>
        </v-sheet>
      </template>
      <template v-else>
        <v-text-field
            label="Search in filter..."
            prepend-inner-icon="mdi-magnify"
            solo
            dense
            flat
            @input="debounceSearch"
            v-model="search"
            :loading="loading"
        ></v-text-field>
          <v-list
              flat
              dense
          >
            <v-list-item-group
                multiple
                active-class=""
                dense
            >
              <v-virtual-scroll
                  :items="filteredItems"
                  :item-height="40"
                  bench="50"
                  height="200"
              >
                <template v-slot:default="{ item }">
                  <v-list-item
                      :key="`item-${item.key}`"
                      :value="item.key"
                      dense
                      active-class="text--accent"
                      @change="updateItems(item.key)"
                  >
                    <template v-slot:default="{ active }">
                      <v-list-item-action class="my-0 mr-3">
                        <v-checkbox
                            dense
                            :input-value="model.indexOf(item.key) > -1"
                            color="accent"
                        ></v-checkbox>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title v-text="item.value"></v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                  <v-divider class="my-0"></v-divider>
                </template>
              </v-virtual-scroll>
            </v-list-item-group>
          </v-list>
      </template>
      <v-card-actions class="mt-3">
        <v-btn
            small
            color="secondary"
            class="elevation-0"
            :disabled="!isActive()"
            @click="clearFilter"
        >
          Clear
        </v-btn>
        <v-spacer></v-spacer>
        <v-tooltip v-if="selected.length > 3" top open-delay="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              class="text-center"
              v-bind="attrs"
              v-on="on"
              @click="tagsExpand = !tagsExpand"
            >
              <v-icon small>mdi-arrow-{{tagsExpand ? 'up' : 'down'}}</v-icon>
            </v-btn>
          </template>
          <span>{{tagsExpand ? 'Shrink' : 'Expand'}} Selected</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            @click="applyFilter"
            small
            class="elevation-0"
        >
          Filter
        </v-btn>
      </v-card-actions>
      <div style="max-width: 300px">
        <v-chip-group show-arrows :column="tagsExpand">
          <v-chip
              v-for="tag in selected"
              :key="tag.key"
              close
              small
              color="primary"
              @click:close="removeItem(tag.key)"
          >
            <v-tooltip top open-delay="1000">
              <template v-slot:activator="{ on, attrs }">
                <span class="selected-chip" v-bind="attrs" v-on="on">{{ tag.value }}</span>
              </template>
              <span>{{ tag.value }}</span>
            </v-tooltip>
          </v-chip>
        </v-chip-group>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import { debounce } from 'debounce';

export default {
  props: {
    type: {
      type: String,
      default: 'items',
    },
    items: {
      type: Array,
      default: () => [],
    },
    values: {
      default: () => [],
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    entity: String,
  },
  data() {
    return {
      menu: false,
      search: '',
      model: [],
      selected: [],
      loading: true,
      tagsExpand: false,
    };
  },
  methods: {
    debounceSearch: debounce(function (value) {
      this.loading = true;
      this.$emit('search', value, this.entity);
    }, 700),
    updateItems(item) {
      if (this.model.indexOf(item) < 0) {
        this.model.push(item);
      } else {
        this.model.splice(this.model.indexOf(item), 1);
      }
    },
    applyFilter() {
      const data = this.type === 'range' && this.model[0] === this.min && this.model[1] === this.max ? [] : this.model;
      this.$emit('apply', data, this.entity);
      this.menu = false;
    },
    clearFilter() {
      if (this.type === 'range') {
        this.model = [this.min, this.max];
      } else {
        this.model = [];
      }
      this.applyFilter();
    },
    removeItem(id) {
      this.model.splice(this.model.indexOf(id), 1);
    },
    isActive() {
      if (this.type === 'range') {
        return this.min !== this.max;
      }
      return this.model.length;
    },
  },
  mounted() {
    this.model = this.type === 'range' ? [this.min, this.max] : [];
  },
  computed: {
    active() {
      if (this.type === 'range') {
        return this.menu || !(this.model[0] === this.min && this.model[1] === this.max);
      }
      return this.menu || this.model.length;
    },
    filteredItems() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.loading = false;
      return this.search
        ? this.items.filter((i) => i.value.toLowerCase().includes(this.search.toLowerCase()))
        : this.items;
    },
  },
  watch: {
    values() {
      if (this.values && this.values.length) {
        this.model = this.values;
      } else {
        this.model = this.type === 'range' ? [this.min, this.max] : [];
      }
    },
    model() {
      const selected = [...this.items.filter((i) => this.model.indexOf(i.key) >= 0)];
      let newSelected = this.selected.concat(selected);
      newSelected = [...new Map(newSelected.map((item) => [item.key, item])).values()];
      this.selected = newSelected.filter((i) => this.model.indexOf(i.key) >= 0);
    },
    items() {
      const selected = [
        ...this.items.filter((i) => this.model.map((m) => m.toString()).indexOf(i.key) >= 0),
      ];
      let newSelected = this.selected.concat(selected);
      newSelected = [...new Map(newSelected.map((item) => [item.key, item])).values()];
      this.selected = newSelected.filter(
        (i) => this.model.map((m) => m.toString()).indexOf(i.key) >= 0,
      );
    },
    min() {
      if (!this.values || !this.values.length) {
        this.model[0] = this.type === 'range' ? this.min : this.model[0];
      }
    },
    max() {
      if (!this.values || !this.values.length) {
        this.model[1] = this.type === 'range' ? this.max : this.model[1];
      }
    },
  },
};
</script>

<style lang="sass">
  .v-card.filter-wrapper
    background-color: #E3EEF4 !important
    border: 1px solid #ACC3CF !important
  .selected-chip
    max-width: 98px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
</style>
