<template>
  <div class="bills-container">
    <PageHeader />

    <section class="row justify-content-center  bill-body">
      <!-- 侧边栏 -->
      <div class="col-md-2">
        <div class="box box-primary">
          <div class="box-header with-border">
            <h5 class="box-title">配送客户</h5>
          </div>
          <div class="box-body no-padding">
            <!-- 改进 nav 样式，确保垂直排列 -->
            <ul class="nav nav-pills nav-stacked" style="max-height: 600px; overflow-y: auto; display: block;">
              <li v-for="(item, index) in depList" :key="item.nxDepartmentId" :id="item.nxDepartmentId"
                :class="{ 'active': isactive === index, 'tab-item': true }"
                @click="onclick(index, item.nxDepartmentId, item.nxDepartmentId,item.nxDepartmentAttrName, '',item.nxDepartmentPrintName)">
                <a>{{ item.nxDepartmentName }}</a>
                <ul v-if="item.nxDepartmentEntities && item.nxDepartmentEntities.length > 0" class="sub-department-list"
                  style="list-style-type: none; padding-left: 20px;">
                  <li v-for="(subItem, subIndex) in item.nxDepartmentEntities" :key="subItem.nxDepartmentId"
                    :class="{ 'active': isactiveSub === subIndex, 'tab-item': true }"
                    @click="childClick(index, item.nxDepartmentId, subItem.nxDepartmentId, item.nxDepartmentAttrName,  '-'+subItem.nxDepartmentAttrName, subItem.nxDepartmentPrintName,$event)">
                    <a>{{ subItem.nxDepartmentName }}</a>
                  </li>
                </ul>
              </li>
              <!-- 显示子部门 -->

            </ul>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="col-md-10 row">
        <keep-alive>
          <component :is="depPrintName" :nxDepFatherId="nxDepFatherId" :nxDepId="nxDepId" :depName="depName" :depPrintName="depPrintName"
            :updateTime="updateTime" :disId="disId" :disName="disName"></component>
        </keep-alive>
      </div>
    </section>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import api from "../api/orderCustomer";
import ApplyPanel from "../components/Applys/ApplyPanel.vue";
import ApplyFiftyPanel from '../components/Applys/ApplyFiftyPanel.vue'
import ApplyHalfPanel from '../components/Applys/ApplyHalfPanel.vue';
import ApplyHalfWholePanel from "../components/Applys/ApplyHalfWholePanel.vue";

export default {
  name: "Bills",

  components: {
    PageHeader,
    ApplyPanel,
    ApplyFiftyPanel,
    ApplyHalfPanel,
    ApplyHalfWholePanel
  },


  data() {
    return {
      depList: [],
      isactive: 0,
      gbDepId: -1,
      disId: null,
      resFatherId: -1,
      gbDisId: -1,
      comId: -1,
      nxDepFatherId: "",
      nxDepId: "",
      depName: "",
      depPrintName: "",
      currPage: 1,
      limit: 10,
      totalCount: "",
      totalPage: "",
      updateTime: new Date().getMilliseconds()
    }
  },

  created() {
    // 获取 URL 中的 query 参数 disId
    this.disId = this.$route.query.disId;
    this.disName = this.$route.query.disName;

    console.log('获取到的 disId:', this.disId, this.disName);
  },
  computed: {
    disUser() {
      return this.$store.state.disUser;
    },

    currentTabComponent() {
      return this.depPrintName;
    }
  },

  mounted() {
    const disId = this.disUser.nxDiuDistributerId;
    api.webNxDisGetTodayOrderCustomer(disId).then(res => {
      if (res) {
        console.log("delisiis", res.data);
        this.depList = res.data;
        this.nxDepFatherId = res.data[0].nxDepartmentId;
        this.nxDepId = res.data[0].nxDepartmentId;
        this.depName = res.data[0].nxDepartmentName;
        this.depPrintName = res.data[0].nxDepartmentPrintName;
      }
      console.log("this.nxdefatheid=" , this.nxDepFatherId)
    });
  },

  methods: {
    onclick(index, nxDepFatherId, nxDeId,depName, subDepName,depPrintName) {
      console.log("subnamem", subDepName);

      this.isactive = index;
      this.nxDepFatherId = nxDepFatherId;
      this.nxDepId = nxDeId,
      this.depName = depName + subDepName;
      this.depPrintName = depPrintName;
      this.updateTime = new Date().getMilliseconds();
    },
    childClick(index, nxDepFatherId, nxDeId,depName, subDepName,depPrintName,event) {
      // 阻止事件冒泡，防止触发父部门的点击事件
      event.stopPropagation();

      // 更新子部门的选中状态
      this.isactive = index;
      this.nxDepFatherId = nxDepFatherId;
      this.nxDepId = nxDeId,
      this.depName = depName + subDepName;
      this.depPrintName = depPrintName;
      this.updateTime = new Date().getMilliseconds();
      console.log("点击了子部门:", subDepName);
      
      // 可以在这里处理子部门的具体逻辑，比如传递参数等
    }

  }
}
</script>

<style scoped>
/* 侧边栏和内容区域的整体布局 */
.bills-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.bill-body{
  padding: 20px;
}
/* 侧边栏样式 */
.box-primary {
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.box-header {
  background-color: #3c8dbc;
  color: white;
  padding: 10px 20px;
  border-radius: 10px 10px 0 0;
  font-size: 18px;
  text-align: center;
}

.box-body {
  padding: 10px;
}

.nav-pills {
  list-style: none;
  padding-left: 0;
  display: block;
}

.nav-pills .tab-item {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s ease;
}

.nav-pills .tab-item:hover {
  background-color: #f4f4f4;
  color: #000;
}

.tab-item .active{
  background-color: #3c8dbc
}

.nav-pills .active {
  background-color: #590381;
  color: #fff;
  font-weight: bold;
}

/* 主内容区域样式 */
.col-md-9 {
  padding-left: 20px;
  padding-right: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #fff;
  overflow-y: auto;
  height: 100%;
}

.col-md-9 .box {
  border-radius: 10px;
  margin-bottom: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  .col-md-3,
  .col-md-9 {
    width: 100%;
    padding: 10px;
  }

  .nav-pills {
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>