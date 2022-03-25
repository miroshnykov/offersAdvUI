<template>
  <div>
    <v-row>
      <v-col>
        <h1>Offers</h1>
      </v-col>
      <v-col>
        <v-btn
          color="primary"
          class="float-right"
          dark
          @click="createOffer"
        >
          Create
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :loading="$apollo.queries.offers.loading"
      :headers="headers"
      :items="offers.data"
      :server-items-length="offers.count"
      :page.sync="table.currentPage"
      :items-per-page.sync="table.itemsPerPage"
      :sort-by.sync="table.sortBy"
      :sort-desc.sync="table.sortDesc"
      :must-sort="true"
      :disable-sort="true"
      @update:page="updateOffers"
      @update:sort-by="updateOffers"
      @update:sort-desc="updateOffers"
      @update:items-per-page="updateOffers"
      :footer-props="{'items-per-page-options': [5, 10, 25, 50]}"
      :class="`elevation-0 mt-2 fixed-height co-data-table items-size-${table.heightCounter}`"
    >
      <template v-slot:top>
        <DataTableTopBar @search="searchInTable"/>
      </template>

      <template
        v-for="(item, index) of headers"
        :slot="`header.${[item.value]}`"
        slot-scope="{header}"
      >
        <data-filter
          v-if="table.filters.hasOwnProperty(header.value)"
          :items="table.filters[header.value].data"
          :entity="header.value"
          :values="table.filters[header.value].selected"
          @apply="submitFilter"
          @search="updateDataInFilters"
          :key="index"
        />
        <a
          v-if="header.sortable === undefined || header.sortable"
          @click="sortColumn(header.value)"
          :key="item.value"
        >
          <span class="header_title">{{header.text}}</span>
          <v-icon
            size="16"
            color="#7F98A5"
          >
            mdi-arrow-{{
              header.value === table.sortBy
                ? table.sortDesc
                ? 'up'
                : 'down'
                : 'up-down'
            }}
          </v-icon>
        </a>
        <span :key="item.value + index" v-else class="header_title">{{header.text}}</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn text small @click="edit(item.id, item.step)">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="item.status === 'inactive' || item.status === 'pending'"
          text
          small
          @click="sure(item.id)"
        >
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.status="{ item }">
        <Status :status="item.status"/>
      </template>
      <template v-slot:item.payin="{ item }">
        {{safeSymbol(item)}}{{item.payin}}
      </template>
      <template v-slot:item.url="{ item }">
        {{ !!item.landing_page && item.landing_page.url ? item.landing_page.url : '-' }}
      </template>
    </v-data-table>
    <DataTableBottomBar
      :showFilter="Object.values(table.filters).find(f => f.selected.length) !== undefined"
      @clearFilters="removeAllFilters"
      v-model="table.heightCounter"
    />
    <v-dialog
      v-model="isDeleteVisible"
      max-width="400"
    >
      <v-card>

        <v-card-title class="text-h5">
          Are you sure want to delete?
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="grey lighten-1"
            text
            @click="disagree"
          >
            Disagree
          </v-btn>

          <v-btn
            color="primary"
            @click="remove"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ListOfferQuery } from '@/graphql/ListOfferQuery';
import {
  IdQuery,
  ConversionTypeQuery,
  NameQuery,
  PayinQuery,
  StatusQuery,
} from '@/graphql/OfferFilterQueries';
import { RemoveOfferMutation } from '@/graphql/RemoveOfferMutatuin';
import { CreateOfferMutation } from '@/graphql/CreateOfferMutation';
import Status from '@/components/snipets/status.vue';
import DataTableTopBar from '@/components/common/DataTableTopBar.vue';
import DataTableBottomBar from '@/components/common/DataTableBottomBar.vue';
import DataFilter from '@/components/common/DataFilter.vue';
import { event } from '@/utils/eventBus';
import { OffersVariables } from '@/graphql/__generated__/Offers';

export default Vue.extend({
  name: 'Home',
  components: {
    Status,
    DataTableTopBar,
    DataTableBottomBar,
    DataFilter,
  },
  apollo: {
    offers: {
      query: ListOfferQuery,
      variables(): OffersVariables {
        return {
          pagination: {
            currentPage: this.table.currentPage,
            itemsPerPage: this.table.itemsPerPage,
            sortBy: this.table.sortBy,
            sortDesc: this.table.sortDesc,
          },
        } as OffersVariables;
      },
      update: (data) => data.listOffer,
    },
    offersId: {
      query: IdQuery,
      variables(): OffersVariables {
        return {
          pagination: {
            itemsPerPage: 50,
            sortBy: 'id',
          },
          column: 'id',
        } as OffersVariables;
      },
      update(data) {
        this.prepareFilterData(data, 'id');
      },
    },
    offersName: {
      query: NameQuery,
      variables(): OffersVariables {
        return {
          pagination: {
            itemsPerPage: 50,
            sortBy: 'name',
          },
          column: 'name',
        } as OffersVariables;
      },
      update(data) {
        this.prepareFilterData(data, 'name');
      },
    },
    offersConversionType: {
      query: ConversionTypeQuery,
      variables(): OffersVariables {
        return {
          pagination: {
            itemsPerPage: 50,
            sortBy: 'conversion_type',
          },
          column: 'conversion_type',
        } as OffersVariables;
      },
      update(data) {
        this.prepareFilterData(data, 'conversion_type');
      },
    },
    offersPayin: {
      query: PayinQuery,
      variables(): OffersVariables {
        return {
          pagination: {
            itemsPerPage: 50,
            sortBy: 'payin',
          },
          column: 'payin',
        } as OffersVariables;
      },
      update(data) {
        this.prepareFilterData(data, 'payin');
      },
    },
    offersStatus: {
      query: StatusQuery,
      variables(): OffersVariables {
        return {
          pagination: {
            itemsPerPage: 50,
            sortBy: 'status',
          },
          column: 'status',
        } as OffersVariables;
      },
      update(data) {
        this.prepareFilterData(data, 'status');
      },
    },
  },
  data() {
    return {
      isDeleteVisible: false,
      wantToDelete: 0,
      isCreateVisible: false,
      createName: '',
      loading: true,
      items: [],
      itemsCount: -1,
      headers: [
        {
          text: 'Id',
          sortable: true,
          value: 'id',
        },
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: 'Conversion Type', value: 'conversion_type' },
        { text: 'Pay In', value: 'payin' },
        { text: 'Default LP', value: 'url' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', sortable: false, value: 'actions' },
      ],
      table: {
        heightCounter: 45,
        currentPage: 1,
        itemsPerPage: 10,
        sortBy: 'name',
        sortDesc: true,
        search: '',
        filters: {
          id: { selected: [], data: [] },
          name: { selected: [], data: [] },
          conversion_type: { selected: [], data: [] },
          payin: { selected: [], data: [] },
          status: { selected: [], data: [] },
        } as any,
      },
    };
  },
  mounted(): void {
    event.$on('reloadOffers', () => {
      this.getFiltersData();
      this.updateOffers();
    });
  },
  methods: {
    sortColumn(value: string) {
      this.table.sortDesc = (this.table.sortBy === value) ? !this.table.sortDesc : true;
      this.table.sortBy = value;
      this.updateOffers();
    },
    submitFilter(data: Array<string>, entity: string): Promise<void> {
      this.table.currentPage = 0;
      if (data && entity) {
        this.table.filters[entity].selected = data;
      }
      return this.updateOffers();
    },
    async updateDataInFilters(data: string, modalName: string) {
      if (modalName) {
        const filterName = `offers${this.capitalizeFirstLetter(modalName)}`;
        await this.$apollo.queries[filterName].refetch({
          pagination: {
            itemsPerPage: 50,
          },
          search: data,
        });
      }
    },
    capitalizeFirstLetter(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    async removeAllFilters() {
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const key in this.table.filters) {
        this.table.filters[key].selected = [];
      }
      await this.updateOffers();
    },
    searchInTable(value: string) {
      this.table.search = value;
      this.updateOffers();
    },
    createOffer() {
      event.$emit('createOffer');
    },
    async updateOffers(): Promise<void> {
      const queryVariables: any = {
        filters: {},
        pagination: {
          currentPage: this.table.currentPage,
          itemsPerPage: this.table.itemsPerPage,
          sortBy: this.table.sortBy,
          sortDesc: this.table.sortDesc,
        },
      };

      const filtersTemp = this.table.filters;
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const prop in filtersTemp) {
        if (filtersTemp[prop].selected && filtersTemp[prop].selected.length > 0) {
          queryVariables.filters[prop] = filtersTemp[prop].selected;
        }
      }

      queryVariables.search = this.table.search;

      await this.$apollo.queries.offers.refetch(queryVariables);
    },
    async getFiltersData() {
      const promises: any = [];

      this.headers.forEach((object) => {
        promises.push(this.$apollo.queries[object.value].refetch({
          pagination: {
            itemsPerPage: 50,
          },
          column: object.value,
        }));
      });

      await Promise.all(promises);
    },
    prepareFilterData(data: any, column: string) {
      const preparedData = data.listOffer.data.map((value: any) => ({
        key: value[column],
        value: value[column],
      }));
      this.table.filters[column].data = preparedData;
      return preparedData;
    },
    async remove() {
      try {
        await this.$apollo.mutate({
          mutation: RemoveOfferMutation,
          variables: {
            id: this.wantToDelete,
          },
        });
        await this.$apollo.queries.offers.refetch();
        this.$toast.success('Offer successfully moved');
        this.disagree();
      } catch (error) {
        if (error.graphQLErrors[0].message) {
          this.$toast.error(error.graphQLErrors[0].message);
        } else {
          this.$toast.error(error.message);
        }
      }
    },
    disagree() {
      this.wantToDelete = 0;
      this.isDeleteVisible = false;
    },
    sure(id: number) {
      this.wantToDelete = id;
      this.isDeleteVisible = true;
    },
    edit(id: string, step: number) {
      if (step) {
        event.$emit('updateOffer', id);
      } else {
        this.$router.push(`/offer/${id}`);
      }
    },
    async create() {
      const result = await this.$apollo.mutate({
        mutation: CreateOfferMutation,
        variables: {
          name: this.createName,
        },
      });
      this.cancelCreate();
      this.$toast.success('Offer successfully created');
      await this.$apollo.queries.offers.refetch();
      this.edit(result.data.createOffer.id, 0);
    },
    cancelCreate() {
      this.createName = '';
      this.isCreateVisible = false;
    },
    safeSymbol(item: any) {
      const found = item.currencies.find((cur: any) => cur.id === item.currency_id);
      return found ? found.symbol : '$';
    },
  },
});
</script>

<style lang="scss" scoped>
.co-data-table {
  .v-data-table__wrapper {
    .v-data-table-header {
      th {
        white-space: nowrap;
      }
    }
  }
}
</style>
