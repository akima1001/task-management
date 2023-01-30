import pluralize from 'pluralize'
import { DefaultNamingStrategy } from 'typeorm'
import { snakeCase } from 'typeorm/util/StringUtils'

const removeModelString = (targetName: string) => {
  return targetName.replace(/Model$/, '')
}

export class TypeOrmNamingStrategy extends DefaultNamingStrategy {
  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName || pluralize(snakeCase(removeModelString(targetName)))
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return (
      snakeCase(embeddedPrefixes.join('_')) +
      (customName || snakeCase(removeModelString(propertyName)))
    )
  }

  relationName(propertyName: string): string {
    return snakeCase(removeModelString(propertyName))
  }

  joinColumnName(relationName: string, _referencedColumnName: string): string {
    return snakeCase(`${pluralize.singular(removeModelString(relationName))}`)
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    _firstPropertyName: string,
    _secondPropertyName: string
  ): string {
    return snakeCase(`${removeModelString(firstTableName)}_${removeModelString(secondTableName)}`)
  }

  joinTableColumnName(tableName: string, _propertyName: string, _columnName?: string): string {
    return snakeCase(`${pluralize.singular(removeModelString(tableName))}`)
  }
}
