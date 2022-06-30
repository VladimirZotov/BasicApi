using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using BasicApi.Data;
using BasicApi.Dto;
using BasicApi.Models;

namespace BasicApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecordsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IRecordRepo _recordRepo;
        
        public RecordsController(IMapper mapper, IRecordRepo recordRepo)
        {
            _mapper = mapper;
            _recordRepo = recordRepo;
        }
        [HttpPost]
        public ActionResult Create(List<RecordCreateDto> dataCreateDto)
        {

            _recordRepo.ClearRecords();
            _recordRepo.SaveChanges();

            dataCreateDto.OrderBy(x => x.Code);

            var dataRecords = _mapper.Map<List<Record>>(dataCreateDto);

            for (var i = 0; i < dataRecords.Count; i++)
            {
                _recordRepo.CreateRecord(dataRecords[i]);
            }

            _recordRepo.SaveChanges();

            return Ok();
        }
        [HttpGet]
        public IActionResult GetRecords(string? sortColumn, string? sortDirection,
            int? pageNumber, int? pageSize, string? searchColumn, string? search)
        {
            var records = _recordRepo.GetAllRecords(sortColumn, sortDirection, pageNumber, pageSize, searchColumn, search);
            var totalNumber = _recordRepo.GetAllRecords(searchColumn, search).Count();

            var response = new PagedResult<RecordReadDto>()
            {
                TotalNumber = totalNumber,
                List = _mapper.Map<List<RecordReadDto>>(records)
            };

            return Ok(response);
        }
        
    }
}
