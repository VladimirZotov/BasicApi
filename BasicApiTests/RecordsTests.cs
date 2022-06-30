using BasicApi.Dto;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace BasicApiTests
{
    [Collection("Sequential")]
    public class RecordsTests : AppFactory<Program>
    {
        private readonly HttpClient _client = new HttpClient();
        public RecordsTests()
        {
            _client = CreateClient();
        }
        [Fact]
        public async Task CreateRecords_WithValidData_ReturnsOk()
        {

            var jsonCreate = JsonConvert.SerializeObject(new object[]
            {
                new { Code = 1, Value = "value1"},
                new { Code = 5, Value = "value2"},
                new { Code = 10, Value = "value32"},
            });

            var dataCreate = new StringContent(jsonCreate, Encoding.UTF8, "application/json");
            var responseCreate = await _client.PostAsync($"/api/records", dataCreate);

            Assert.Equal(HttpStatusCode.OK, responseCreate.StatusCode);

            var responseGet = await _client.GetAsync($"/api/records");

            Assert.Equal(HttpStatusCode.OK, responseGet.StatusCode);

            var responseString = await responseGet.Content.ReadAsStringAsync();

            var records = JsonConvert.DeserializeObject<PagedResult<RecordReadDto>>(responseString);

            Assert.NotNull(records);
            Assert.Equal(3, records.TotalNumber);
            Assert.Equal(10, records.List[0].Code);
            Assert.Equal("value32", records.List[0].Value);
            Assert.Equal(5, records.List[1].Code);
            Assert.Equal("value2", records.List[1].Value);
            Assert.Equal(1, records.List[2].Code);
            Assert.Equal("value1", records.List[2].Value);

            responseGet = await _client.GetAsync($"/api/records?pageNumber=2&pageSize=1");

            Assert.Equal(HttpStatusCode.OK, responseGet.StatusCode);

            responseString = await responseGet.Content.ReadAsStringAsync();

            records = JsonConvert.DeserializeObject<PagedResult<RecordReadDto>>(responseString);

            Assert.NotNull(records);
            Assert.Equal(3, records.TotalNumber);
            Assert.Equal(1, records.List.Count);
            Assert.Equal(5, records.List[0].Code);
            Assert.Equal("value2", records.List[0].Value);

            responseGet = await _client.GetAsync($"/api/records?searchColumn=value&search=value2");

            Assert.Equal(HttpStatusCode.OK, responseGet.StatusCode);

            responseString = await responseGet.Content.ReadAsStringAsync();

            records = JsonConvert.DeserializeObject<PagedResult<RecordReadDto>>(responseString);

            Assert.NotNull(records);
            Assert.Equal(1, records.TotalNumber);
            Assert.Equal(1, records.List.Count);
            Assert.Equal(5, records.List[0].Code);
            Assert.Equal("value2", records.List[0].Value);
        }
    }
}
