using BasicApi.Models;

namespace BasicApi.Data
{
    public interface IRecordRepo
    {
        bool SaveChanges();
        IEnumerable<Record> GetAllRecords(string searchColumn, string search);
        IEnumerable<Record> GetAllRecords();
        IEnumerable<Record> GetAllRecords(string sortColumn, string sortDirection,
            int? pageNumber, int? pageSize, string searchColumn, string search);
        void CreateRecord(Record data);
        void ClearRecords();
    }
}
