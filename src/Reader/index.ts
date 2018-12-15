import _AbstractTypeReader from './AbstractTypeReader';
import _ArrayTypeReader from './ArrayTypeReader';
import _ChannelTypeReader from './ChannelTypeReader';
import _DateTypeReader from './DateTypeReader';
import _DurationTypeReader from './DurationTypeReader';
import _EnumTypeReader from './EnumTypeReader';
import _MemberTypeReader from './MemberTypeReader';
import _PrimitiveTypeReader from './PrimitiveTypeReader';
import _RoleTypeReader from './RoleTypeReader';
import _UserTypeReader from './UserTypeReader';

export namespace Reader {
    export const AbstractTypeReader = _AbstractTypeReader;
    export const ArrayTypeReader = _ArrayTypeReader;
    export const ChannelTypeReader = _ChannelTypeReader;
    export const DateTypeReader = _DateTypeReader;
    export const DurationTypeReader = _DurationTypeReader;
    export const EnumTypeReader = _EnumTypeReader;
    export const MemberTypeReader = _MemberTypeReader;
    export const PrimitiveTypeReader = _PrimitiveTypeReader;
    export const RoleTypeReader = _RoleTypeReader;
    export const UserTypeReader = _UserTypeReader;
}
