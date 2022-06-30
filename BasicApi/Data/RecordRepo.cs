using BasicApi.Models;
using System.Linq.Expressions;

namespace BasicApi.Data
{
    public class RecordRepo : IRecordRepo
    {
        private readonly AppDbContext _dbContext;
        public RecordRepo(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void ClearRecords()
        {
            var records = GetAllRecords();
            _dbContext.Records.RemoveRange(records);
        }

        public IEnumerable<Record> GetAllRecords()
        {
            return GetAllRecords(null, null, 0, 0, null, null);
        }

        public IEnumerable<Record> GetAllRecords(string searchColumn, string search)
        {
            return GetAllRecords(null, null, 0, 0, searchColumn, search);
        }

        public void CreateRecord(Record record)
        {

            if (record == null)
            { 
                throw new ArgumentNullException(nameof(record));
            }

            _dbContext.Records.Add(record);
        }

        public IEnumerable<Record> GetAllRecords(string sortColumn, string sortDirection, int? pageNumber, int? pageSize,
            string searchColumn, string search)
        {
            var pNumber = pageNumber != null && pageNumber > 0 ? (int)pageNumber : 1;
            var pSize = pageSize != null && pageSize > 0 ? (int)pageSize : 10;

            var result = new List<Record>();

            Expression<Func<Record, bool>> filterBy = x => true;
            if (!string.IsNullOrEmpty(searchColumn) && !string.IsNullOrEmpty(search))
            {
                switch (searchColumn)
                {
                    case "value":
                        filterBy = x => x.Value.ToLower().Contains(search.ToLower().Trim());
                        break;
                    case "code":
                        filterBy = x => x.Code == int.Parse(search.Trim());
                        break;
                    default:
                        break;
                }

            }

            Expression<Func<Record, object>> orderBy = x => x.Id;

            if (sortColumn != null)
            {
                switch (sortColumn)
                {
                    case "value":
                        orderBy = x => x.Value;
                        break;
                    case "code":
                        orderBy = x => x.Code;
                        break;
                    default:
                        break;
                }

            }

            var tresult = _dbContext.Records
                    .Where(filterBy);

            if (sortDirection == "asc")
            {
                tresult = tresult.OrderBy(orderBy);
            }
            else
            {
                tresult = tresult.OrderByDescending(orderBy);
            }

            if (pSize > 0)
            {
                tresult = tresult.Skip((pNumber - 1) * pSize).Take(pSize);
            }

            result = tresult.ToList();

            return result;
        }

        public bool SaveChanges()
        {
            return _dbContext.SaveChanges() >= 0;
        }
    }
}
