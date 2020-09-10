import { ITable, IWhere } from '../../protocols'

export async function DeleteStrategy(table: ITable): Promise<void> {
  const idCondition = table._where.filter(
    (condition: IWhere) => condition.column.toLowerCase() === 'id'
  )[0]
  if (!idCondition)
    throw new Error('Id on where condition was not specified at DeleteStrategy')

  await table
    .client()
    .request(
      'SP',
      'POST',
      `/_api/Web/Lists/GetByTitle('${table._table}')/Items(${idCondition.value})/recycle()`,
      {
        contentType: 'application/json;odata=verbose',
        accept: 'application/json;odata=verbose',
        'IF-MATCH': '*',
        'X-HTTP-Method': 'DELETE',
      }
    )
}
