import { http } from '@/common/service/service.js' 
import configService from '@/common/service/config.service.js';

	// export  function getHistoryList(data) {
	//   return request({
	//     url: `${BASE_URL}/generic/historys`,
	//     method: 'get',
	//     params:data
	//   })
	// }
	const apiHistoryService = {
	
		getHistoryList(pageNo,pageSize) {
			return http.get('/generic/historys?pageNo='+pageNo+'&pageSize='+pageSize)	
		}
		}
		export default apiHistoryService;
	
