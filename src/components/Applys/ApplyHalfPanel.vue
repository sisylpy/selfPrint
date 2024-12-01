<template>

      <div  class="applyBodyPage ">
    <div class=" card  shadow-lg p-20" style="min-height: 500px;">
        <!-- 页头 -->
        <div class="headerPage">
            <div class="header-content">
                <div class="leftPage">
                    <div class="item">单位: {{ depName }}</div>
                    <div class="item">时间: {{ todayDate }}</div>
                </div>
                <div class="centerPage">
                    <div class="title">{{ disName }} 送货单</div>
                </div>

                <div class="rightPage">
                    <div class="item">共{{ totalPages }}页 - 第{{ pagesIndex }}页</div>
                    <div class="item">单号: {{ tradeNo }}</div>
                </div>
            </div>
        </div>

      

        <!-- 订单内容部分 -->
        <div class="content-bill">
            <div class="left_bill_page">
                <div class="table-header">
                    <div class="ten">序号</div>
                    <div class="thirty">商品</div>
                    <div class="fifteen">规格</div>
                    <div class="ten">数量</div>
                    <div class="fifteen" >单价</div>
                    <div class="twenty">小计</div>
                </div>

                <!-- 订单信息 -->
                <div class="table-row" v-for="(item, index) in currentPageData.leftColumn" :key="'left-' + index">

                    <div class="ten">{{ index + 1 }}</div>
                    <div class="thirty">{{ item.nxDistributerGoodsEntity.nxDgGoodsName }}</div>
                    <div class="fifteen">{{ item.nxDistributerGoodsEntity.nxDgGoodsStandardname }}</div>
                    <div class="ten">{{ item.nxDoWeight }}</div>
                    <div class="fifteen">{{ item.nxDoPrice }}</div>
                    <div class="twenty">{{ item.nxDoSubtotal }}</div>
                </div>
            </div>

            <div class="middle_bill_page">
                <div class="table-header">
                    <div class="ten">序号</div>
                    <div class="thirty">商品</div>
                    <div class="fifteen">规格</div>
                    <div class="ten">数量</div>
                    <div class="fifteen" >单价</div>
                    <div class="twenty">小计</div>
                </div>

                <!-- 订单信息 -->
                <div class="table-row" v-for="(item, index) in currentPageData.rightColumn" :key="'right-' + index">
                    <div class="ten">{{ index + 13 }}</div>
                    <div class="thirty">{{ item.nxDistributerGoodsEntity.nxDgGoodsName }}</div>
                    <div class="fifteen">{{ item.nxDistributerGoodsEntity.nxDgGoodsStandardname }}</div>
                    <div class="ten">{{ item.nxDoWeight }}</div>
                    <div class="fifteen">{{ item.nxDoPrice }}</div>
                    <div class="twenty">{{ item.nxDoSubtotal }}</div>
                </div>
            </div>
        </div>

        <!-- 合计信息 -->
        <div class="summary pr-10" style="border-bottom: 1px solid gray; border-left: 1px solid gray; border-right: 1px solid gray;">
            <div class="fifty_line" >
                <div class="pl-10">
                    地址: {{ disUser.nxDistributerEntity.nxDistributerAddress }}
                </div>
            </div>
            <div class="centerPage text-right pr-10" >
                <div>第{{ pagesIndex }}页小计: {{ currentPageData.pageSubtotal }}</div>
            </div>
        </div>

        <!-- 页脚 -->
        <div class="footerPage" v-if="totalPages == pagesIndex">
            <!-- 合计信息 -->
            <div class="summary pr-10">
                <div class="" style="background-color: red;">
                    <div></div>
                </div>
                <div class="text-right pr-10" style="font-size: 18px">
                    <div>{{ subtotalHanzi }} 合计: {{ subtotal }}</div>
                </div>
            </div>
          
        </div>

    </div>

    <div class="d-flex justify-content-between p-20">
              <button class="btn btn-lg btn-primary" @click="generatePrintContent">
                <i class="fas fa-print"></i> 开始打印
              </button>
              <div>
                <ul class="pagination pagination-sm">
                  <li class="page-item">
                    <button class="page-link" @click="changePage(pagesIndex - 1)" :disabled="pagesIndex <= 1">上一页</button>
                  </li>
                  <li class="page-item">
                    <button class="page-link"  @click="changePage(pagesIndex + 1)" :disabled="pagesIndex >= totalPages">下一页</button>
                  </li>
                </ul>
              </div>
            </div>
    <div id="printArea"></div>
</div>

</template>



<script>
import api from '@/api/all'
import PrintSave from '../Applys/PrintSave.vue'
import ApplyCheck from '../Applys/ApplyCheck.vue'

// import { jsPDF } from "jspdf";
// import { PDFDocument, rgb } from 'pdf-lib';
// import { ipcRenderer } from 'electron';
// const __dirname = window.electron.__dirname;


export default {
    name: "ApplyHalfPanel",
    props: ['nxDepFatherId', 'nxDepId', 'depName', 'depPrintName', 'updateTime'],
    computed: {
        currentPageData() {
            // 确保 applyArrPrint 是一个数组

            if (!Array.isArray(this.applyArrPrint)) {
                return { leftColumn: [], rightColumn: [] }; // 如果数据为空或格式不正确，返回空列
            }
            // 当前页的起始位置和结束位置
            const start = (this.pagesIndex - 1) * 24;
            const end = start + 24;

            console.log("this.applyarrprintt....", this.applyPrintArr)
            // 获取当前页的数据
            const pageData = this.applyArrPrint.slice(start, end);

            // 将每页的数据分为两列，前12条为左列，后12条为右列
            const leftColumn = pageData.slice(0, 12);
            const rightColumn = pageData.slice(12, 24);

            // 计算当前页的合计
            const pageSubtotal = pageData.reduce((acc, item) => acc + parseFloat(item.nxDoSubtotal || 0), 0);

            const pageSubtotalHanzi = this.numberToChinese(pageSubtotal);
            return {
                leftColumn,
                rightColumn,
                pageSubtotal,
                pageSubtotalHanzi
            };
        },
        disUser() {
            return this.$store.state.disUser;
        },
        disId() {
            return this.$store.state.disUser.nxDistributerEntity.nxDistributerId;
        },
        disName() {
            return this.$store.state.disUser.nxDistributerEntity.nxDistributerName;
        },
        todayDate() {
            var today = new Date();
            var year = today.getFullYear();//获取年份
            var month = today.getMonth() + 1;//获取月份
            var day = today.getDate();//获取日期
            console.log(year + "-" + month + "-" + day);
            return year + "-" + month + "-" + day;
        },
    },
    watch: {

        // nxDepFatherId: function (newVal) {

        //     this.getToFillDepOrdersForPrint();

        // },
        nxDepId: function (newVal) {
            this.pagesIndex = 1;
            this.totalPages = "";
            this.applyPrintArr =  [];
            this.applyArr =  [];
            this.subtotal = 0;
            this.subtotalHanzi =  "";
            this.getToFillDepOrdersForPrint();
        },


        // 监听applyArrPrint的变化，重新计算页数
        applyArrPrint() {
            this.calculateTotalPages();
        },


    },

    components: {
        PrintSave,
        ApplyCheck
    },
    data() {
        return {
            pagesIndex: 1, // 当前页
            totalPages: "", // 总页数
            applyPrintArr: [],
            applyArr: [],
            subtotal: 0,
            subtotalHanzi: "",
            gbDepId: -1,
            resFatherId: -1,
            gbDisId: -1,
            comId: -1,
           
            tradeNo: "",
            disUser: { // 送货人信息
                nxDistributerEntity: {
                    nxDistributerAddress: '送货地址'
                }
            },
            disName: '',
            applyArrPrint: [], // 假设从外部获取到的订单数据
            subtotalHanzi: '', // 合计大写
            subtotal: 0,

        }
    },


    mounted() {

        // this.getToFillDepOrdersForPrint();
        // 初始化页面数据

        this.fetchOrderData().then(() => {
            console.log("订单数据加载完成：", this.applyArrPrint);
            this.calculateTotalPages();  // 数据加载完成后计算总页数
        }).catch(error => {
            console.error("加载订单数据失败：", error);
        });

    },


    methods: {


        calculateTotalPages() {
            this.totalPages = Math.ceil(this.applyArrPrint.length / 24);
            console.log("cultootapapge---111111", this.totalPages);
        },
        // 切换页面
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.pagesIndex = page; // 更新当前页
        },



        printOk() {
            console.log("chauanprintOkprintOk");
            // this.bus.$emit('loading', true);
            var ids = [];
            for (var i = 0; i < this.applyArrPrint.length; i++) {
                var id = this.applyArrPrint[i].nxDepartmentOrdersId;
                ids.push(id);
            }
            var bill = {
                nxDbTradeNo: this.tradeNo,
                nxDbDepId: this.nxDepId,
                nxDbDepFatherId: this.nxDepId,
                nxDbTotal: this.subtotal,
                nxDbIssueUserId: this.disUser.nxDistributerUserId,
                nxOrderIds: ids,
                nxDbPrintTimes: 1,
                nxDbGbDisId: this.gbDisId,
                nxDbDisId: this.disUser.nxDiuDistributerId,
                nxDbGbDepId: this.gbDepId,
                nxDbNxCommunityId: this.comId,
                nxDbNxRestrauntId: this.resFatherId
            };
            api.saveAccountBill(bill).then(res => {
                if (res) {
                    // this.bus.$emit('loading', false);
                    window.location.reload();
                }
            })


        },


        //////////0000
        // 计算需要的打印页数
    calculateTotalPages() {
      const totalRows = this.applyArrPrint.length; // 数据总行数
      const rowsPerPage = 12; // 每列12行
      const columnsPerPage = 2; // 每页两列
      const totalRowsPerPage = rowsPerPage * columnsPerPage; // 每页最大行数
      // 计算打印所需总页数
      return Math.ceil(totalRows / totalRowsPerPage);;
    },

    // 创建每一页的头部内容
    createHeader(pageIndex,totalPriPage) {
        return `
            <div class="header" style="width: 100%; float:left; border-bottom: 1px solid gray; ">
                <div style="width: 85%; margin-left: 7.5%; line-height: 36px; float:left; font-size: 14px;">
                    <div style="width: 34%; float: left;">
                        <div style="line-height: 36px; font-size: 14px;">单位: ${this.depName}</div>
                    </div>
                    <div style="width: 33%; float: left; text-align: center; font-size: 24px;">${this.disName}送货单</div>
                    <div style="width: 33%; float: left; text-align: right; font-size: 12px;">
                        <div style="line-height: 18px;">共${totalPriPage}页  第${pageIndex}页</div>
                        <div style="line-height: 18px;">时间: ${this.todayDate}</div>
                    </div>
                </div>
            </div>
        `;
    },

    // 创建每一页的页脚内容
    createFooter() {
         const address = this.disUser.nxDistributerEntity.nxDistributerAddress !== 1
            ? this.disUser.nxDistributerEntity.nxDistributerAddress
            : "送货人: ";
        return `
            <div class="myFooter" style="width: 100%; float:left; font-size: 14px;">
                <div style="width: 100%; line-height: 36px; float:left;">
                    <div style="width: 60%; margin-left: 5%; float: left;">
                        <div>地址: ${address}</div>
                    </div>
                </div>
            </div>
        `;
    },

    // 创建单个页面的内容，分为两列显示
    createPageContent(pageIndex) {
      const rowsPerPage = 12; // 每列12行
      const columnsPerPage = 2; // 每页2列
      const startIndex = (pageIndex - 1) * rowsPerPage * columnsPerPage;
      const endIndex = pageIndex * rowsPerPage * columnsPerPage;

      // 获取当前页的数据
      const currentPageData = this.applyArrPrint.slice(startIndex, endIndex);

      let pageContent = '';
      // 将数据按列分组，每列12行
      for (let col = 0; col < columnsPerPage; col++) {
        let columnContent = '';
        for (let row = 0; row < rowsPerPage; row++) {
          const dataIndex = col * rowsPerPage + row;
          if (currentPageData[dataIndex]) {
            const rowData = currentPageData[dataIndex];
              columnContent +=`
            <div class="oneItem" style="float: left;width: 100%; border-bottom: 1px solid gray; line-height: 24px; text-align: center;font-size: 12px;">
                <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 10%; border-right: 1px solid gray;border-left: 1px solid gray;">${row + 1}</div>
                <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 30%; border-right: 1px solid gray; text-align: left; padding-left: 10px;">${rowData['nxDistributerGoodsEntity']['nxDgGoodsName']}</div>
                <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 15%; border-right: 1px solid gray;">${rowData['nxDoPrintStandard']}</div>
                <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 10%; border-right: 1px solid gray;">${rowData['nxDoWeight']}</div>
                <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 15%; border-right: 1px solid gray;">${rowData['nxDoPrice']}</div>
                <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 20%; border-right: 1px solid gray;">${rowData['nxDoSubtotal']}</div>
            </div>
        `;

          }
        }
        pageContent += `<div style="float: left; width: 50%;">${columnContent}</div>`;
      }

      return pageContent;
    },

    // 打印内容生成
    generatePrintContent() {
      // 计算总页数
      const totalPages = this.calculateTotalPages();

      // 清空之前的打印内容
      const printArea = document.getElementById('printArea');
      printArea.innerHTML = '';

      // 循环生成每一页的 HTML 内容
      for (let pageIndex = 1; pageIndex <= totalPages; pageIndex++) {
        const pageHtml = `
          <div id="page${pageIndex}" class="applyBody">
            ${this.createHeader(pageIndex, totalPages)}
            <div class="content_bill" style="width: 90%; margin-left: 5%; float: left; border-bottom: 1px solid gray; border-right: 1px solid gray;">
              ${this.createPageContent(pageIndex)}
            </div>
            <div style="box-sizing: border-box; float: left; width: 100%; line-height: 24px; text-align: center; font-size: 13px; border-top: 1px solid gray;">
              <div style="box-sizing: border-box; float: left; width: 50%; border-left: 1px solid gray; padding-right: 10px; text-align: left;">
                <div>合计大写: ${this.numberToChinese(this.subtotal)}</div>
              </div>
              <div style="box-sizing: border-box; float: left; width: 50%; border-right: 1px solid gray; text-align: right; padding-right: 10px;">
                合计: ${this.subtotal}
              </div>
            </div>
            ${this.createFooter()}
          </div>
        `;
        printArea.innerHTML += pageHtml;
      }

      // 打印页面
      this.print();
    },

    // 打印页面的逻辑
    print() {
   
    const printContent = document.getElementById('printArea').innerHTML;

// 使用 Electron 的 API 发送打印请求到主进程
window.electron.sendPrintRequest(printContent);
setTimeout(() => {
    
    window.electron.triggerEnterKey(); // 模拟按下回车键，确认打印
  }, 2000);  
    },

        // ////！！！！！！


     calculateTotalPages(data, itemsPerPage = 24) {
    return Math.ceil(this.applyArrPrint.length / 24); // 向上取整，确保最后一页即使不足也算一页
},



//  createHeader0(pageIndex) {
//     return `
//             <div class="header" style="width: 100%; float:left;">
//                 <div style="width: 85%; margin-left: 7.5%; line-height: 36px; float:left; font-size: 14px;">
//                     <div style="width: 34%; float: left;">
//                         <div style="line-height: 36px; font-size: 14px;">单位: ${this.depName}</div>
//                     </div>
//                     <div style="width: 33%; float: left; text-align: center; font-size: 24px;">${this.disName}送货单</div>
//                     <div style="width: 33%; float: left; text-align: right; font-size: 12px;">
//                         <div style="line-height: 18px;">共${totalPriPage}页  第${pageIndex}页</div>
//                         <div style="line-height: 18px;">时间: ${this.todayDate}</div>
//                     </div>
//                 </div>
//             </div>
//         `;
// },


//  createPageContent(pageIndex, data, itemsPerPage = 24) {
//     let startIdx = (pageIndex - 1) * itemsPerPage;
//     let endIdx = startIdx + itemsPerPage;
//     let pageData = data.slice(startIdx, endIdx);

//     let contentHtml = '<ul>';
//     // pageData.forEach(item => {
//     //     // contentHtml += `<li>${item.name} - ${item.quantity} x ${item.price}</li>`;
//     //     contentHtml +=  this.createItemRow(arr[i], i + 1);
//     // });
//     for (let i = startIndex; i < endIndex; i++) {
//             contentHtml += createItemRow(data[i], i + 1);
//         }
//     contentHtml += '</ul>';

//     return contentHtml;

// },

// createFooter() {
//     const address = this.disUser.nxDistributerEntity.nxDistributerAddress !== 1
//             ? this.disUser.nxDistributerEntity.nxDistributerAddress
//             : "送货人: ";
//         return `
//             <div class="myFooter" style="width: 100%; float:left; font-size: 14px;">
//                 <div style="width: 100%; line-height: 36px; float:left;">
//                     <div style="width: 60%; margin-left: 5%; float: left;">
//                         <div>地址: ${address}</div>
//                     </div>
//                 </div>
//             </div>
//         `;
// },

//  generatePrintContentcc(data, totalPages, createHeader, createPageContent, createFooter) {
//     let printContent = '';

//     // 循环生成每一页
//     for (let i = 1; i <= totalPages; i++) {
//         const pageHtml = `
//             <div id="page${i}" class="applyBody"></div>
//             ${createHeader(i)}  <!-- 页眉 -->
//             <div class="content_bill" style="border-bottom: 1px solid gray; border-right: 1px solid gray;">
//                 <div class="left_bill" style="width: 50%;">${createPageContent(i, data)}</div> <!-- 内容区1 -->
//                 <div class="middle_bill" style="width: 50%;">${createPageContent(i, data)}</div> <!-- 内容区2 -->
//             </div>
//             ${createFooter()} <!-- 页脚 -->
//         `;
//         printContent += pageHtml;
//     }

//     return printContent;
// },

//  generateFullHtmlContent(data) {
//     let totalPages = this.calculateTotalPages(data); // 计算总页数
//     let content = this.generatePrintContentvv(data, totalPages, this.createHeader, this.createPageContent, this.createFooter); // 生成内容

//     return `
//         <html>
//         <head>
//             <style scoped>
//                 /* 设置打印样式 */
//                 @media print {
//                     @page {
//                         size: 241.3mm 139.7mm;
//                         margin: 10mm;
//                     }

//                     body {
//                         font-size: 12pt;
//                     }

//                     .no-print {
//                         display: none;
//                     }
//                 }
//             </style>
//         </head>
//         <body>
//             ${content}
//         </body>
//         </html>
//     `;
// },

printDeliveryOrder333() {
    // let data = getData(); // 假设 getData() 返回你需要打印的订单数据
    let printHtml = this.generateFullHtmlContent(this.applyArrPrint); // 获取完整的 HTML 内容

    // 发送打印请求到主进程
    window.electron.sendPrintRequest(printHtml);
},



//     generatePrintContentaa: function () {
    
//     var arr = this.applyArrPrint;
//     var arrLen = arr.length;
//     var totalGoods = 24;  // 每页显示24条
//     var totalPriPage = Math.ceil(arrLen / totalGoods);  // 总页数

//     const createHeader = (pageIndex) => {
//         return `
//             <div class="header" style="width: 100%; float:left;">
//                 <div style="width: 85%; margin-left: 7.5%; line-height: 36px; float:left; font-size: 14px;">
//                     <div style="width: 34%; float: left;">
//                         <div style="line-height: 36px; font-size: 14px;">单位: ${this.depName}</div>
//                     </div>
//                     <div style="width: 33%; float: left; text-align: center; font-size: 24px;">${this.disName}送货单</div>
//                     <div style="width: 33%; float: left; text-align: right; font-size: 12px;">
//                         <div style="line-height: 18px;">共${totalPriPage}页  第${pageIndex}页</div>
//                         <div style="line-height: 18px;">时间: ${this.todayDate}</div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     };

//     const createFooter = () => {
//         const address = this.disUser.nxDistributerEntity.nxDistributerAddress !== 1
//             ? this.disUser.nxDistributerEntity.nxDistributerAddress
//             : "送货人: ";
//         return `
//             <div class="myFooter" style="width: 100%; float:left; font-size: 14px;">
//                 <div style="width: 100%; line-height: 36px; float:left;">
//                     <div style="width: 60%; margin-left: 5%; float: left;">
//                         <div>地址: ${address}</div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     };

//     const createItemRow = (item, index) => {
//         return `
//             <div class="oneItem" style="float: left;width: 100%; border-bottom: 1px solid gray; line-height: 24px; text-align: center;font-size: 12px;">
//                 <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 10%; border-right: 1px solid gray;">${index}</div>
//                 <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 30%; border-right: 1px solid gray; text-align: left; padding-left: 10px;">${item['nxDistributerGoodsEntity']['nxDgGoodsName']}</div>
//                 <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 15%; border-right: 1px solid gray;">${item['nxDoPrintStandard']}</div>
//                 <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 10%; border-right: 1px solid gray;">${item['nxDoWeight']}</div>
//                 <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 15%; border-right: 1px solid gray;">${item['nxDoPrice']}</div>
//                 <div style="word-break: keep-all; box-sizing: border-box; float: left; width: 20%; border-right: 1px solid gray;">${item['nxDoSubtotal']}</div>
//             </div>
//         `;
//     };

//     const createPageContent = (pageIndex) => {
//         const startIndex = (pageIndex - 1) * totalGoods;
//         const endIndex = Math.min(pageIndex * totalGoods, arrLen);
//         let contentHtml = '';
        
//         for (let i = startIndex; i < endIndex; i++) {
//             contentHtml += createItemRow(arr[i], i + 1);
//         }
        
//         return contentHtml;
//     };

//     // 清空之前的打印内容
//     $('#testDeliveryHalf').empty();

//     // 循环生成每一页
//     for (let i = 1; i <= totalPriPage; i++) {
//         const pageHtml = `
//             <div id="page${i}" class="applyBody"></div>
//             <div id="top${i}" style="width: 100%; float: left; height: 50px;"></div>
//             ${createHeader(i)}
//             <div class="content_bill" style="width: 90%; margin-left: 5%; float: left; border-bottom: 1px solid gray; border-right: 1px solid gray;">
//                 <div class="left_bill" style="float: left; width: 50%;">${createPageContent(i)}</div>
//                 <div class="middle_bill" style="float: left; width: 50%;">${createPageContent(i)}</div>
//             </div>
//             <div style="box-sizing: border-box; float:left; width: 100%; line-height: 24px; text-align: center; font-size: 13px; border-top: 1px solid gray;">
//                 <div style="box-sizing: border-box; float:left; width: 50%; border-left: 1px solid gray; padding-right: 10px; text-align: left;">
//                     <div>合计大写: ${this.numberToChinese(this.subtotal)}</div>
//                 </div>
//                 <div style="box-sizing: border-box; float:left; width: 50%; border-right: 1px solid gray; text-align: right; padding-right: 10px;">
//                     合计: ${this.subtotal}
//                 </div>
//             </div>
//             ${createFooter()}
//         `;

//         $('#testDeliveryHalf').append(pageHtml);

      
//     }


// },

// 触发打印请求
printDeliveryOrder1() {
    let content = this.generatePrintContentdd();

    // 生成打印内容的完整 HTML
    let printStr = "<html><head><title>打印</title></head>" + content + "</body></html>";

    // 发送打印请求到主进程
    window.electron.sendPrintRequest(printStr);
},

        // printDeliveryOrder1: function () {
        //     console.log("modallalal")

        //     var arr = this.applyArrPrint;
        //     var arrLen = this.applyArrPrint.length;
        //     var totalGoods = 24;
        //     var totalPriPage = Math.ceil(arrLen / totalGoods);
        //     if (totalPriPage <= 1) {

        //         var applyBody = `<div id="page1" class="applyBody"  ></div>`
        //         $('#testDeliveryHalf').append(applyBody);
        //         var top = `<div class="" style="width: 100%; float: left; height: 50px; "></div>`
        //         $('#page1').append(top);

        //         var header = `<div class="header" style="width: 100%; float:left; ">
        //                     <div style=" width: 85%; margin-left: 7.5%; line-height: 36px;  float:left; font-size: 14px; " >
        //                        <div  style="width: 34%; float: left; ">
        //                           <div style="line-height: 18px; font-size: 14px;">单位: `+ this.depName + `  </div>
        //                         <div style="line-height: 18px;">时间: ` + this.todayDate + `</div>
        //                        </div>
        //                        <div style="width: 33%; float: left; text-align: center; font-size: 24px;"> ` + this.disName + `送货单 </div>

        //                        <div style="width: 33%; float: left;  text-align: right; font-size: 12px; ">
        //                         <div style="line-height: 18px;">共1页-第1页</div>
        //                         <div style="line-height: 18px;">单号: ` + this.tradeNo + `</div>

        //                        </div>
        //                     </div>
        //                   </div>`;
        //         $('#page1').append(header);

        //         var content = `<div class="content_bill" style="width: 90%; margin-left: 5%; float: left; border-bottom:1px solid gray; border-right:  1px solid gray;  "></div>`

        //         $('#page1').append(content);

        //         var left = `<div class="left_bill" style="float: left; width: 50%;"></div>`
        //         $('.content_bill:eq(0)').append(left);

        //         var oneTitle = `<div style="box-sizing: border-box; float:left; width: 100%; line-height: 30px; text-align: center;font-size: 12px;border-bottom: 1px solid gray;border-top: 1px solid gray;">
        //                         <div style="box-sizing: border-box; float:left; width: 10%; border-right: 1px solid gray; border-left: 1px solid gray;">序号</div>
        //                         <div style="box-sizing: border-box; float:left; width: 30%; border-right: 1px solid gray; ">商品</div>

        //                         <div style="box-sizing: border-box; float:left; width: 15%; border-right: 1px solid gray; ">规格</div>
        //                         <div style="box-sizing: border-box; float:left; width: 10%; border-right: 1px solid gray; ">数量</div>
        //                         <div style="box-sizing: border-box; float:left; width: 15%; border-right: 1px solid gray; ">单价</div>
        //                         <div style="box-sizing: border-box; float:left; width: 20%; border-right: 1px solid gray; ">小计</div>
        //                         </div>`;
        //         $('.left_bill:eq(0)').append(oneTitle);


        //         var middle = `<div class="middle_bill" style="float: left; width: 50%;"></div>`
        //         $('.content_bill:eq(0)').append(middle);

        //         var oneTitle = `<div style="box-sizing: border-box; float:left; width: 100%;  line-height: 30px; text-align: center;font-size: 12px;border-bottom: 1px solid gray;border-top: 1px solid gray;">
        //                         <div style="box-sizing: border-box; float:left; width: 10%; border-right: 1px solid gray; ">序号</div>
        //                         <div style="box-sizing: border-box; float:left; width: 30%; border-right: 1px solid gray; ">商品</div>
        //                         <div style="box-sizing: border-box; float:left; width: 15%; border-right: 1px solid gray; ">规格</div>
        //                         <div style="box-sizing: border-box; float:left; width: 10%; border-right: 1px solid gray; ">数量</div>
        //                         <div style="box-sizing: border-box; float:left; width: 15%; border-right: 1px solid gray; ">单价</div>
        //                         <div style="box-sizing: border-box; float:left; width: 20%; border-right: 1px solid gray; ">小计</div>
        //                         </div>`;
        //         $('.middle_bill:eq(0)').append(oneTitle);


        //         for (var j = 0; j < arr.length; j++) {
        //             if (j < totalGoods / 2) {
        //                 var oneItem = `<div class="oneItem" style="float: left;width: 100%; border-bottom: 1px solid gray;
        //                                                                 line-height: 24px; font-size: 12px; text-align: center;"></div>`
        //                 $('.left_bill:eq(0)').append(oneItem);
        //                 var index = Number(j) + 1;

        //                 var indexC = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 10%; border-right: 1px solid gray;border-left: 1px solid gray; " >` + index + `</div>`
        //                 var nxDgGoodsName = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 30%; border-right: 1px solid gray; text-align: left; padding-left: 10px;" >` + arr[j]['nxDistributerGoodsEntity']['nxDgGoodsName'] + `</div>`
        //                 var nxDoWeight = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 10%; border-right: 1px solid gray; " >` + arr[j]['nxDoWeight'] + `</div>`
        //                 var nxDoStandard = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 15%; border-right: 1px solid gray; " >` + arr[j]['nxDoPrintStandard'] + `</div>`
        //                 var nxDoPrice = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 15%; border-right: 1px solid gray; " >` + arr[j]['nxDoPrice'] + `</div>`
        //                 var nxDoSubtotal = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 20%; border-right: 1px solid gray; " >` + arr[j]['nxDoSubtotal'] + `</div>`;

        //                 $('.oneItem:eq(' + j + ')').append(indexC);
        //                 $('.oneItem:eq(' + j + ')').append(nxDgGoodsName);
        //                 $('.oneItem:eq(' + j + ')').append(nxDoStandard);
        //                 $('.oneItem:eq(' + j + ')').append(nxDoWeight);
        //                 $('.oneItem:eq(' + j + ')').append(nxDoPrice);
        //                 $('.oneItem:eq(' + j + ')').append(nxDoSubtotal);

        //             } else if (totalGoods / 2 <= j && j < totalGoods) {
        //                 var index = Number(j) + 1;

        //                 var oneItem = `<div class="oneItem" style="float: left;width: 100%; border-bottom: 1px solid gray;
        //                                                                 line-height: 24px; text-align: center;font-size: 12px;"></div>`
        //                 $('.middle_bill:eq(0)').append(oneItem);
        //                 var indexC = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 10%; border-right: 1px solid gray;" >` + index + `</div>`
        //                 var nxDgGoodsName = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 30%;  border-right: 1px solid gray; text-align: left; padding-left: 10px;" >` + arr[j]['nxDistributerGoodsEntity']['nxDgGoodsName'] + `</div>`
        //                 var nxDoWeight = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 10%; border-right: 1px solid gray; " >` + arr[j]['nxDoWeight'] + `</div>`
        //                 var nxDoStandard = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 15%; border-right: 1px solid gray; " >` + arr[j]['nxDoPrintStandard'] + `</div>`
        //                 var nxDoPrice = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 15%; border-right: 1px solid gray; " >` + arr[j]['nxDoPrice'] + `</div>`
        //                 var nxDoSubtotal = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 20%; border-right: 1px solid gray; " >` + arr[j]['nxDoSubtotal'] + `</div>`;

        //                 $('.oneItem:eq(' + j + ')').append(indexC);
        //                 $('.oneItem:eq(' + j + ')').append(nxDgGoodsName);
        //                 $('.oneItem:eq(' + j + ')').append(nxDoStandard);
        //                 $('.oneItem:eq(' + j + ')').append(nxDoWeight);
        //                 $('.oneItem:eq(' + j + ')').append(nxDoPrice);
        //                 $('.oneItem:eq(' + j + ')').append(nxDoSubtotal);

        //             }
        //         }

        //         var sub = `<div style="box-sizing: border-box; float:left; width: 100%; line-height: 24px; text-align: center;font-size: 13px;border-top: 1px solid gray;">

        //                         <div style="box-sizing: border-box; float:left; width: 50%; border-left: 1px solid gray; padding-right: 10px; text-align: left;">
        //                         <div>合计大写: `+ this.subtotalHanzi + `</div>
        //                         </div>
        //                         <div style="box-sizing: border-box; float:left; width: 50%;  border-right: 1px solid gray; text-align: right; padding-right: 10px;">合计: ` + this.subtotal + `</div>
        //                         </div>`;
        //         $('.content_bill').append(sub);

        //         if (this.disUser.nxDistributerEntity.nxDistributerAddress !== 1) {
        //             var footer = `<div class="myFooter" style="width: 100%; float:left; font-size: 14px;">
        //                     <div style=" width: 100%; line-height: 36px;  float:left;" >
        //                        <div style="width: 60%;margin-left: 5%; float: left; " >
        //                        <div>地址:`+ this.disUser.nxDistributerEntity.nxDistributerAddress + `</div>
        //                        </div>
        //                     </div>
        //                   </div>`;
        //         } else {
        //             var footer = `<div class="myFooter" style="width: 100%; float:left; font-size: 14px;">
        //                     <div style=" width: 100%; line-height: 36px;  float:left;" >
        //                        <div style="width: 60%;margin-left: 5%; float: left; " >
        //                        <div>送货人: </div>
        //                        </div>
        //                        <div style="width: 33%; float: left; ">送货人: </div>
        //                     </div>
        //                   </div>`;
        //         }

        //         $('#page1').append(footer);




        //     } else {

        //         for (var i = 1; i <= totalPriPage; i++) {
        //             console.log("dayu 45 ge le;")
        //             var newi = i - 1

        //             var applyBody = `<div id=page` + i + ` class="applyBody" ></div>`
        //             $('#testDeliveryHalf').append(applyBody);
        //             var top = `<div class="" style="width: 100%; float: left; height: 50px; "></div>`
        //             $('#' + "page" + i).append(top);

        //             var header = `<div class="header" style="width: 100%; float:left; ">
        //                     <div style=" width: 85%; margin-left: 7.5%; line-height: 36px;  float:left; font-size: 14px; " >
        //                        <div  style="width: 34%; float: left; ">
        //                           <div style="line-height: 36px; font-size: 14px;">单位: `+ this.depName + `  </div>
        //                        </div>
        //                        <div style="width: 33%; float: left; text-align: center; font-size: 24px;"> ` + this.disName + `送货单 </div>

        //                        <div style="width: 33%; float: left;  text-align: right; font-size: 12px; ">
        //                         <div style="line-height: 18px;">共` + totalPriPage + `页  第` + i + `页  </div>
        //                        <div style="line-height: 18px;">时间: ` + this.todayDate + `</div>
        //                        </div>
        //                     </div>
        //                   </div>`;

        //             $('#' + "page" + i).append(header);

        //             var content = `<div class="content_bill" style="width: 90%; margin-left: 5%; float: left; border-bottom:1px solid gray; border-right:  1px solid gray;  "></div>`

        //             $('#' + "page" + i).append(content);

        //             var left = `<div class="left_bill" style="float: left; width: 50%;"></div>`
        //             $('.content_bill:eq(' + newi + ')').append(left);

        //             var oneTitle = `<div style="box-sizing: border-box; float:left; width: 100%; line-height: 30px; text-align: center;font-size: 12px;border-bottom: 1px solid gray;border-top: 1px solid gray;">
        //                         <div style="box-sizing: border-box; float:left; width: 10%; border-right: 1px solid gray; border-left: 1px solid gray;">序号</div>
        //                         <div style="box-sizing: border-box; float:left; width: 30%; border-right: 1px solid gray; ">商品</div>
        //                         <div style="box-sizing: border-box; float:left; width: 15%; border-right: 1px solid gray; ">规格</div>
        //                         <div style="box-sizing: border-box; float:left; width: 10%; border-right: 1px solid gray; ">数量</div> <div style="box-sizing: border-box; float:left; width: 15%; border-right: 1px solid gray; ">单价</div>
        //                         <div style="box-sizing: border-box; float:left; width: 20%; border-right: 1px solid gray; ">小计</div>
        //                         </div>`;
        //             $('.left_bill:eq(' + newi + ')').append(oneTitle);

        //             var middle = `<div class="middle_bill" style="float: left; width: 50%;"></div>`
        //             $('.content_bill:eq(' + newi + ')').append(middle);


        //             var oneTitle = `<div style="box-sizing: border-box; float:left; width: 100%;  line-height: 30px; text-align: center;font-size: 12px;border-bottom: 1px solid gray;border-top: 1px solid gray;">
        //                         <div style="box-sizing: border-box; float:left; width: 10%; border-right: 1px solid gray; ">序号</div>
        //                         <div style="box-sizing: border-box; float:left; width: 30%; border-right: 1px solid gray; ">商品</div>
        //                         <div style="box-sizing: border-box; float:left; width: 15%; border-right: 1px solid gray; ">规格</div>
        //                         <div style="box-sizing: border-box; float:left; width: 10%; border-right: 1px solid gray; ">数量</div>
        //                         <div style="box-sizing: border-box; float:left; width: 15%; border-right: 1px solid gray; ">单价</div>
        //                         <div style="box-sizing: border-box; float:left; width: 20%; border-right: 1px solid gray; ">小计</div>
        //                         </div>`;
        //             $('.middle_bill:eq(' + newi + ')').append(oneTitle);


        //             var pageSubtotal = 0;
        //             for (var j = i * totalGoods - totalGoods; j < i * totalGoods; j++) {

        //                 if (j < arrLen) {
        //                     if (j < (i - 1) * totalGoods + totalGoods / 2) {
        //                         console.log(j)

        //                         var oneItem = `<div class="oneItem" style="float: left;width: 100%; border-bottom: 1px solid gray;
        //                                                                 line-height: 24px; font-size: 12px; text-align: center;"></div>`
        //                         $('.left_bill:eq(' + newi + ')').append(oneItem);
        //                         var index = Number(j) + 1;

        //                         pageSubtotal = Number(pageSubtotal) + Number(arr[j].nxDoSubtotal);

        //                         var indexC = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 10%; border-right: 1px solid gray;border-left: 1px solid gray; " >` + index + `</div>`
        //                         var nxDgGoodsName = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 30%; border-right: 1px solid gray; text-align: left; padding-left: 10px;" >` + arr[j]['nxDistributerGoodsEntity']['nxDgGoodsName'] + `</div>`
        //                         var nxDoWeight = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 10%; border-right: 1px solid gray; " >` + arr[j]['nxDoWeight'] + `</div>`
        //                         var nxDoStandard = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 15%; border-right: 1px solid gray; " >` + arr[j]['nxDoPrintStandard'] + `</div>`
        //                         var nxDoPrice = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 15%; border-right: 1px solid gray; " >` + arr[j]['nxDoPrice'] + `</div>`
        //                         var nxDoSubtotal = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 20%; border-right: 1px solid gray; " >` + arr[j]['nxDoSubtotal'] + `</div>`;

        //                         $('.oneItem:eq(' + j + ')').append(indexC);
        //                         $('.oneItem:eq(' + j + ')').append(nxDgGoodsName);
        //                         $('.oneItem:eq(' + j + ')').append(nxDoStandard);
        //                         $('.oneItem:eq(' + j + ')').append(nxDoWeight);
        //                         $('.oneItem:eq(' + j + ')').append(nxDoPrice);
        //                         $('.oneItem:eq(' + j + ')').append(nxDoSubtotal);
        //                     } else {
        //                         var oneItem = `<div class="oneItem" style="float: left;width: 100%; border-bottom: 1px solid gray;
        //                                                                         line-height: 24px; font-size: 12px; text-align: center;"></div>`
        //                         $('.middle_bill:eq(' + newi + ')').append(oneItem);
        //                         var index = Number(j) + 1;
        //                         pageSubtotal = Number(pageSubtotal) + Number(arr[j].nxDoSubtotal);

        //                         var indexC = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 10%; border-right: 1px solid gray;border-left: 1px solid gray; " >` + index + `</div>`
        //                         var nxDgGoodsName = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 30%; border-right: 1px solid gray; text-align: left; padding-left: 10px;" >` + arr[j]['nxDistributerGoodsEntity']['nxDgGoodsName'] + `</div>`
        //                         var nxDoWeight = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 10%; border-right: 1px solid gray; " >` + arr[j]['nxDoWeight'] + `</div>`
        //                         var nxDoStandard = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 15%; border-right: 1px solid gray; " >` + arr[j]['nxDoPrintStandard'] + `</div>`
        //                         var nxDoPrice = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 15%; border-right: 1px solid gray; " >` + arr[j]['nxDoPrice'] + `</div>`
        //                         var nxDoSubtotal = `<div style="word-break:keep-all;box-sizing: border-box;float: left; width: 20%; border-right: 1px solid gray; " >` + arr[j]['nxDoSubtotal'] + `</div>`;

        //                         $('.oneItem:eq(' + j + ')').append(indexC);
        //                         $('.oneItem:eq(' + j + ')').append(nxDgGoodsName);
        //                         $('.oneItem:eq(' + j + ')').append(nxDoStandard);
        //                         $('.oneItem:eq(' + j + ')').append(nxDoWeight);
        //                         $('.oneItem:eq(' + j + ')').append(nxDoPrice);
        //                         $('.oneItem:eq(' + j + ')').append(nxDoSubtotal);
        //                     }
        //                 }

        //             }

        //             var hanzi = this.numberToChinese(pageSubtotal);

        //             var sub = `<div style="box-sizing: border-box; float:left; width: 100%; line-height: 24px; text-align: center;font-size: 13px;border-top: 1px solid gray;">

        //                         <div style="box-sizing: border-box; float:left; width: 50%; border-left: 1px solid gray; padding-right: 10px; text-align: left;">
        //                         <div>合计大写:  `+ hanzi + `</div>
        //                         </div>
        //                         <div style="box-sizing: border-box; float:left; width: 50%; border-right: 1px solid gray; text-align: right; padding-right: 10px;">合计:` + pageSubtotal + `</div>
        //                         </div>`;
        //             $('.content_bill:eq(' + newi + ')').append(sub);

        //             if (this.disUser.nxDistributerEntity.nxDistributerAddress !== 1) {
        //                 var footer = `<div class="myFooter" style="width: 100%; float:left; font-size: 14px;">
        //                     <div style=" width: 100%; line-height: 36px;  float:left;" >
        //                        <div style="width: 60%;margin-left: 5%; float: left; " >
        //                        <div>地址:`+ this.disUser.nxDistributerEntity.nxDistributerAddress + `</div>
        //                        </div>
        //                     </div>
        //                   </div>`;
        //             } else {
        //                 var footer = `<div class="myFooter" style="width: 100%; float:left; font-size: 14px;">
        //                     <div style=" width: 100%; line-height: 36px;  float:left;" >
        //                        <div style="width: 60%;margin-left: 5%; float: left; " >
        //                        <div>送货人: </div>
        //                        </div>
        //                        <div style="width: 33%; float: left; ">送货人: </div>
        //                     </div>
        //                   </div>`;
        //             }

        //             $('#' + "page" + i).append(footer);



        //         }
        //         var fenye = `<div style="page-break-after:always"></div>`

        //         $('#' + "page" + i).append(fenye);
        //     }

        //     var printStr = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>" +
        //         "<style media=\"print\">" +
        //         "    @page {" +
        //         "      size: auto;  /* auto is the initial value */\n" +
        //         "      margin: 0mm; /* this affects the margin in the printer settings */\n" +

        //         "    }" +
        //         "</style>" +
        //         "</head><body style=' margin: 0;'>";
        //     var content = "";
        //     for (var m = 0; m < totalPriPage; m++) {
        //         var newm = m + 1;
        //         var str = document.getElementById('page' + newm + '').innerHTML;
        //         content = content + str;
        //     }
        //     //height: 140px;


        //     printStr = printStr + content + "</body></html>";


        //     // 发送打印请求到主进程
        //     window.electron.sendPrintRequest(printStr);


        // },


        numberToChinese(num) {
            // 定义汉字数字
            const units = ["", "拾", "佰", "仟"];
            const sectionUnits = ["", "万", "亿", "万亿"];
            const numMap = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];

            if (num === 0) return "零元整";

            // 分离整数和小数部分
            let [integer, decimal] = String(num).split(".");
            decimal = decimal ? decimal.slice(0, 2) : "";

            // 转换整数部分
            const integerToChinese = (integer) => {
                let result = "";
                let section = 0;
                let zero = false;

                while (integer.length > 0) {
                    let part = integer.slice(-4);  // 每4位为一段
                    integer = integer.slice(0, -4);
                    let str = "";

                    for (let i = 0; i < part.length; i++) {
                        const digit = Number(part[part.length - 1 - i]);
                        if (digit === 0) {
                            zero = true;
                        } else {
                            if (zero) {
                                str = numMap[0] + str;
                                zero = false;
                            }
                            str = numMap[digit] + units[i] + str;
                        }
                    }
                    if (str) {
                        result = str + sectionUnits[section] + result;
                    }
                    section++;
                }

                return result + "元";
            };

            // 转换小数部分
            const decimalToChinese = (decimal) => {
                if (!decimal) return "整";
                let result = "";
                if (decimal[0]) result += numMap[decimal[0]] + "角";
                if (decimal[1]) result += numMap[decimal[1]] + "分";
                return result;
            };

            return integerToChinese(integer) + decimalToChinese(decimal);
        },



        getToFillDepOrdersForPrint: function (e) {
            var data = "depFatherId=" + parseInt(this.nxDepFatherId) + "&depId=" + parseInt(this.nxDepId) + "&gbDepFatherId=" + parseInt(this.gbDepId) + "&resFatherId="
                + parseInt(this.resFatherId) + "&disId=" + this.disId;
            api.disGetToFillDepOrders(data).then(res => {

                console.log("prinarr", res.data.arr);
                this.subAmount = res.data.subAmount;
                this.tradeNo = res.data.tradeNo;
                this.canPrint = res.data.canPrint;
                this.subtotal = res.data.total;
                this.subtotalHanzi = res.data.totalHanzi;
                this.aaa = res.data.arr;
                if (res.data.subAmount > 0) {
                    var temp = [];
                    for (var i = 0; i < res.data.arr.length; i++) {
                        console.log("lennntt=====" + res.data.arr[i].depOrders.length);
                        temp = temp.concat(res.data.arr[i].depOrders);
                        if (this.selectedIndex == i) {
                            this.depsPart[this.selectedIndex].total = res.data.arr[i].depSubtotal;
                        }
                    }
                    console.log("resuss===", temp);
                    this.applyArrPrint = temp;

                    console.log("resuss===applyArrPrint", this.applyArrPrint);
                } else {
                    this.applyArrPrint = res.data.arr;
                }

            });

            return this.applyPrintArr;

        },


        async fetchOrderData() {
            try {
                // 构建请求参数
                const data = `depFatherId=${parseInt(this.nxDepId)}&gbDepFatherId=${parseInt(this.gbDepId)}&resFatherId=${parseInt(this.resFatherId)}&disId=${this.disId}`;

                // 发送请求
                const res = await api.disGetToFillDepOrders(data);

                console.log("prinarr", res.data.arr);
                this.subAmount = res.data.subAmount;
                this.tradeNo = res.data.tradeNo;
                this.canPrint = res.data.canPrint;
                this.subtotal = res.data.total;
                this.subtotalHanzi = res.data.totalHanzi;
                this.aaa = res.data.arr;

                // 如果有子订单，处理它们
                if (res.data.subAmount > 0) {
                    let temp = [];

                    for (let i = 0; i < res.data.arr.length; i++) {
                        console.log("lennntt=====" + res.data.arr[i].depOrders.length);
                        temp = temp.concat(res.data.arr[i].depOrders);

                        // 更新当前选中的部门子订单总计
                        if (this.selectedIndex === i) {
                            this.depsPart[this.selectedIndex].total = res.data.arr[i].depSubtotal;
                        }
                    }

                    console.log("resuss===", temp);
                    this.applyArrPrint = temp; // 更新订单数据
                } else {
                    this.applyArrPrint = res.data.arr; // 直接赋值
                }

            } catch (error) {
                console.error("请求数据失败:", error);
            }
        },


        getSubDepApply(index) {

            console.log("getSubDepApplygetSubDepApply", index);
            this.selectedIndex = index;
            this.applyArr = this.depsPart[index].page.list;
            this.totalCount = this.depsPart[index].page.totalCount;
            this.totalPage = this.depsPart[index].page.totalPage;
            this.totalCount = this.depsPart[index].page.totalCount;
            this.currPage = this.depsPart[index].page.currPage;

        }



    }
}
</script>


<style scoped>
/* 设置打印样式 */

@media print {
    @page {
        size: 241.3mm 139.7mm;
        margin: 10mm;
    }

    body {
        font-size: 12pt;
    }

    .no-print {
        display: none;
    }
}

.applyBodyPage {
    width: 100%;
    /* padding: 20px; */
    box-sizing: border-box;
    /* 确保内边距被包含在宽度内 */
    background-color: #fff;
}

.p-20 {
    padding: 20px;
  
}

.headerPage {
    width: 100%;
    /* margin-bottom: 20px; */
    font-size: 14px;
}

.header-content {
    display: flex;
    justify-content: space-between;
}

.leftPage,
.rightPage {
    width: 30%;
}


.fifty_line {
    width: 50%;
}

.centerPage {
    width: 40%;
    text-align: center;
}

.title {
    font-size: 18px;
    font-weight: bold;
}

.item {
    font-size: 14px;
    line-height: 24px;
}

.content-bill {
    display: flex;
    justify-content: space-between;
    /* margin-bottom: 20px; */
    border: 1px solid #ccc;
    box-sizing: border-box;
    /* 防止布局溢出 */
}

.left_bill_page,
.middle_bill_page {
    width: 50%;
    box-sizing: border-box;
    /* 确保宽度不超出父容器 */
}

.text-right {
    text-align: right;
}

.table-header {
    display: flex;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    border-bottom: 1px solid gray;
    border-top: 1px solid gray;
}

.table-header .col {
    /* width: 16.66%; */
    /* padding: 5px; */
    /* box-sizing: border-box; */
}

.table-row {
    display: flex;
    line-height: 24px;
    font-size: 12px;
    text-align: center;
    border-bottom: 1px solid gray;
}

.table-row .col {
    width: 16.66%;
    padding: 5px;
    box-sizing: border-box;
}

.summary {
    display: flex;
    justify-content: space-between;
    /* margin-bottom: 20px; */
    font-size: 14px;
}

.footerPage {
    text-align: leftPage;
    font-size: 14px;
}

.address {
    margin-top: 10px;
}

.address div {
    margin-bottom: 5px;
}

.pr-10 {
    padding-right: 10px;
}

.pl-10{
    padding-left: 10px;
}

.ten{
    width: 10%;
    border-right: 1px solid gray;
}

.fifteen{
    width: 15%;
    border-right: 1px solid gray;
}

.twenty{
    width: 20%;
    border-right: 1px solid gray;
}

.thirty{
    width: 30%;
    border-right: 1px solid gray;
}



</style>
