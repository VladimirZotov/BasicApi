using AutoMapper;
using BasicApi.Dto;

namespace BasicApi.Profiles
{
    public class RecordProfile : Profile
    {
        public RecordProfile()
        {
            CreateMap<RecordCreateDto, BasicApi.Models.Record>();
            CreateMap<BasicApi.Models.Record, RecordReadDto>();
        }
    }
}
